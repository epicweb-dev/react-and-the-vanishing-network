import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import * as db from './db.js'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.get('/', async (c) => {
	const count = await db.getCount()
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>PEMPA Counter</title>
		</head>
		<body>
			<h1 id="count">Count: ${count}</h1>
			<form id="counter-form" method="POST" action="/update-count">
				<button type="submit" name="change" value="-1">Decrement</button>
				<button type="submit" name="change" value="1">Increment</button>
			</form>
			<script src="/ui/index.js" type="module"></script>
		</body>
		</html>
	`
	return c.html(html)
})

app.post('/update-count', async (c) => {
	const formData = await c.req.formData()
	const change = Number(formData.get('change'))
	const updatedCount = await db.changeCount(change)

	if (c.req.header('Accept')?.includes('text/html')) {
		return c.redirect('/')
	} else {
		return c.json({ count: updatedCount })
	}
})

app.use(
	'/ui/*',
	serveStatic({
		root: './ui',
		rewriteRequestPath: (path) => path.replace('/ui', ''),
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
