import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { loader, action } from './index.server.js'
import { Counter } from './public/index.js'
import { Router } from './public/router.js'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.get('/', async (c) => {
	const loaderData = await loader()
	const app = renderToString(
		h(Router, { initialLoaderData: loaderData }, h(Counter)),
	)

	const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>React 19 Counter</title>
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
			<div id="root">${app}</div>
			<script>
				window.__initialLoaderData__ = ${JSON.stringify(loaderData)};
			</script>
			<script src="/ui.js" type="module"></script>
		</body>
		</html>
	`
	return c.html(html)
})

app.on('GET', ['/.data', '/:path.data', '/:path/:path2.data'], async (c) => {
	const loaderData = await loader()
	return c.json(loaderData)
})

app.post('/', async (c) => {
	const actionData = await action({ request: c.req })

	// progressive enhancement
	if (c.req.header('Accept').includes('text/html')) {
		return c.redirect('/')
	}

	return c.json(actionData)
})

app.use(
	'/*',
	serveStatic({
		root: './public',
		index: '',
	}),
)

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})

closeWithGrace(async ({ signal, err }) => {
	if (err) console.error('Shutting down server due to error', err)
	else console.log('Shutting down server due to signal', signal)

	await new Promise((resolve) => server.close(resolve))
	process.exit()
})
