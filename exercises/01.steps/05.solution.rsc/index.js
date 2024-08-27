import { readFile } from 'fs/promises'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { RESPONSE_ALREADY_SENT } from '@hono/node-server/utils/response'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import { createElement as h } from 'react'
import {
	renderToPipeableStream,
	decodeReply,
} from 'react-server-dom-esm/server'
import { Counter } from '../ui/counter.js'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.use(
	'/ui/*',
	serveStatic({
		root: './ui',
		rewriteRequestPath: (path) => path.replace('/ui', ''),
	}),
)

app.use(
	'/*',
	serveStatic({
		root: './public',
		index: '',
		onNotFound: async (path, c) => {
			const html = await readFile('./public/index.html', 'utf8')
			return c.html(html, 200)
		},
	}),
)

const moduleBasePath = new URL('../ui', import.meta.url).href

async function renderApp(context, returnValue) {
	const root = h(Counter)
	const payload = { root, returnValue }
	const { pipe } = renderToPipeableStream(payload, moduleBasePath)
	pipe(context.env.outgoing)
	return RESPONSE_ALREADY_SENT
}

app.get('/rsc', async (context) => renderApp(context, null))

app.post('/action', async (context) => {
	const serverReference = context.req.header('rsc-action')
	const [filepath, name] = serverReference.split('#')
	const action = (await import(filepath))[name]
	// Validate that this is actually a function we intended to expose and
	// not the client trying to invoke arbitrary functions. In a real app,
	// you'd have a manifest verifying this before even importing it.
	if (action.$$typeof !== Symbol.for('react.server.reference')) {
		throw new Error('Invalid action')
	}

	const formData = await context.req.formData()
	const args = await decodeReply(formData, moduleBasePath)
	const result = await action(...args)
	return await renderApp(context, result)
})

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})

closeWithGrace(async ({ signal, err }) => {
	if (err) console.error('Shutting down server due to error', err)
	else console.log('Shutting down server due to signal', signal)

	await new Promise((resolve) => server.close(resolve))
	process.exit()
})
