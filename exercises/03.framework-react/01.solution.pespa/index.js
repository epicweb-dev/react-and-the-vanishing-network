import fs from 'node:fs/promises'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import * as db from './db.js'
import { Counter } from './ui/counter.js'
import * as framework from './ui/framework.js'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.use(
	'/ui/*',
	serveStatic({
		root: './ui',
		rewriteRequestPath: (path) => path.replace('/ui', ''),
	}),
)

app.get('/data', async (c) => {
	const data = await framework.handleLoaderRequest(c.req)
	return c.json(data)
})

app.get('/*', async (c) => {
	const initialData = await framework.handleLoaderRequest(c.req)
	const appHtml = renderToStaticMarkup(
		h(framework.FrameworkProvider, { initialData }, h(Counter)),
	)
	const html = `
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="color-scheme" content="dark light">
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>PESPA Counter</title>
				<script type="importmap">
					{
						"imports": {
							"react": "https://esm.sh/react@19.0.0-beta-94eed63c49-20240425?pin=v126&dev",
							"react-dom": "https://esm.sh/react-dom@19.0.0-beta-94eed63c49-20240425?pin=v126&dev",
							"react-dom/client": "https://esm.sh/react-dom@19.0.0-beta-94eed63c49-20240425/client?pin=v126&dev"
						}
					}
				</script>
			</head>
			<body>
				<div id="root">${appHtml}</div>
				<script>window.__initialData = ${JSON.stringify(initialData)}</script>
				<script type="module" src="/ui/index.js"></script>
			</body>
		</html>
	`
	return c.html(html)
})

app.post('/*', async (c) => {
	const response = await framework.handleActionRequest(c.req)

	if (c.req.header('Accept')?.includes('text/html')) {
		return c.redirect(c.req.url)
	} else {
		return c.json(response)
	}
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
