import { serve } from '@hono/node-server'
// 💰 gonna need this for static files
// import { serveStatic } from '@hono/node-server/serve-static'
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
			<!-- 🐨 add an id to the h1 -->
			<h1>Count: ${count}</h1>
			<!-- 🐨 add an id to the form -->
			<form action="/update-count" method="POST">
				<button type="submit" name="change" value="-1">Decrement</button>
				<button type="submit" name="change" value="1">Increment</button>
			</form>
			<!-- 🐨 add a script module for ui/index.js -->
		</body>
		</html>
	`
	return c.html(html)
})

app.post('/update-count', async (c) => {
	const formData = await c.req.formData()
	const change = Number(formData.get('change'))
	await db.changeCount(change)
	// 🐨 if the request accept header is expecting html, then do this redirect
	return c.redirect('/')
	// 🐨 otherwise, return a json response with the new count
})

// 💰 you need to serve the ui directory as static files:
// app.use(
// 	'/ui/*',
// 	serveStatic({
// 		root: './ui',
// 		rewriteRequestPath: (path) => path.replace('/ui', ''),
// 	}),
// )

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})

closeWithGrace(async ({ signal, err }) => {
	if (err) console.error('Shutting down server due to error', err)
	else console.log('Shutting down server due to signal', signal)

	await new Promise((resolve) => server.close(resolve))
	process.exit()
})
