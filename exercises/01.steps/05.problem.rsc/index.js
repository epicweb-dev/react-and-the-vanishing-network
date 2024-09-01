import { readFile } from 'fs/promises'
import { Writable, Readable } from 'stream'
import { Worker } from 'worker_threads'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { RESPONSE_ALREADY_SENT } from '@hono/node-server/utils/response'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { createFromNodeStream } from 'react-server-dom-esm/client'
import { v4 as uuidv4 } from 'uuid'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.use(
	'/ui/*',
	serveStatic({
		root: './ui',
		rewriteRequestPath: (path) => path.replace('/ui', ''),
	}),
)

const worker = new Worker('./rsc/worker.js', {
	execArgv: [
		'--import',
		'./rsc/register-loader.js',
		'--conditions',
		'react-server',
	],
})

const requestHandlers = new Map()

worker.on('message', (message) => {
	const handler = requestHandlers.get(message.requestId)
	if (handler) {
		handler(message)
		if (message.type === 'end') {
			requestHandlers.delete(message.requestId)
		}
	}
})

app.get('/rsc', async (c) => {
	const requestId = uuidv4()
	return c.body(
		new ReadableStream({
			start(controller) {
				requestHandlers.set(requestId, (message) => {
					if (message.type === 'chunk') {
						controller.enqueue(message.data)
					} else if (message.type === 'end') {
						controller.close()
					}
				})
				worker.postMessage({ type: 'rsc', requestId })
			},
			cancel() {
				requestHandlers.delete(requestId)
			},
		}),
	)
})

app.get('/', async (c) => {
	const rscResponse = await fetch(`${new URL('/rsc', c.req.url).href}`)
	const rscStream = rscResponse.body

	// Convert Web ReadableStream to Node.js Readable stream
	const nodeReadable = Readable.fromWeb(rscStream)

	const moduleBasePath = new URL('./ui', import.meta.url).href
	const moduleBaseURL = '/ui'

	let root
	const Root = () => {
		if (!root) {
			const result = React.use(
				createFromNodeStream(nodeReadable, moduleBasePath, moduleBaseURL),
			)
			root = result.root
		}
		return root
	}

	const { pipe } = renderToPipeableStream(React.createElement(Root), {
		importMap: {
			imports: {
				react:
					'https://esm.sh/react@19.0.0-beta-94eed63c49-20240425?pin=v126&dev',
				'react-dom':
					'https://esm.sh/react-dom@19.0.0-beta-94eed63c49-20240425?pin=v126&dev',
				'react-dom/client':
					'https://esm.sh/react-dom@19.0.0-beta-94eed63c49-20240425/client?pin=v126&dev',
				'react-server-dom-esm/client':
					'https://esm.sh/@kentcdodds/tmp-react-server-dom-esm@19.0.0-beta-94eed63c49-20240425/client?pin=v126&dev',
			},
		},
		bootstrapModules: ['/ui/index.js'],
	})

	c.header('Content-Type', 'text/html')
	return c.body(
		new ReadableStream({
			start(controller) {
				controller.enqueue(
					`
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>RSC Counter</title>
	</head>
	<body>
		<div id="root">`,
				)
				const writable = new Writable({
					write(chunk, encoding, callback) {
						controller.enqueue(chunk)
						callback()
					},
					final(callback) {
						controller.enqueue(`</div>
	</body>
</html>
`)
						controller.close()
						callback()
					},
				})

				pipe(writable)
			},
		}),
	)
})

app.post('*', async (c) => {
	const requestId = uuidv4()
	const formData = await c.req.formData()
	const serverReference = c.req.header('rsc-action')

	const serializedFormData = await serializeFormData(formData)

	if (c.req.header('Accept').includes('text/html')) {
		return new Promise((resolve) => {
			requestHandlers.set(requestId, (message) => {
				if (message.type === 'end') {
					resolve(c.redirect('/'))
				}
			})
			worker.postMessage({
				type: 'action',
				requestId,
				formData: serializedFormData,
				serverReference,
			})
		})
	} else {
		return c.body(
			new ReadableStream({
				start(controller) {
					requestHandlers.set(requestId, (message) => {
						if (message.type === 'chunk') {
							controller.enqueue(message.data)
						} else if (message.type === 'end') {
							controller.close()
						}
					})
					worker.postMessage({
						type: 'action',
						requestId,
						formData: serializedFormData,
						serverReference,
					})
				},
				cancel() {
					requestHandlers.delete(requestId)
				},
			}),
		)
	}
})

async function serializeFormData(formData) {
	const serialized = {}
	for (const [key, value] of formData.entries()) {
		if (value instanceof File) {
			const buffer = await value.arrayBuffer()
			serialized[key] = {
				type: 'file',
				name: value.name,
				lastModified: value.lastModified,
				buffer: Array.from(new Uint8Array(buffer)),
			}
		} else {
			serialized[key] = { type: 'string', value }
		}
	}
	return serialized
}

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})

closeWithGrace(async ({ signal, err }) => {
	if (err) console.error('Shutting down server due to error', err)
	else console.log('Shutting down server due to signal', signal)

	await new Promise((resolve) => server.close(resolve))
	worker.terminate()
	process.exit()
})
