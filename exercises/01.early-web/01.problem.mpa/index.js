import { serve } from '@hono/node-server'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import * as db from './db.js'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.get('/', async (c) => {
	// 🐨 get the count from the database with db.getCount()
	const html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>MPA Counter</title>
		</head>
		<body>
			<!-- 🐨 render the count here -->
			<!-- 🐨 render the form here with the action set to /update-count and method POST -->
			<!-- 🐨 render two submit buttons here, one for incrementing and one for decrementing the count (use the name "change" and value of -1 or 1) -->
		</body>
		</html>
	`
	return c.html(html)
})

// 🐨 add a POST route for /update-count
// 🐨 get the form data from the request
// 🐨 get the change value from the form data (and convert it to a number)
// 🐨 change the count with db.changeCount(change)
// 🐨 redirect to '/' (POST -> REDIRECT -> GET)

const server = serve({ fetch: app.fetch, port: PORT }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`)
})

closeWithGrace(async ({ signal, err }) => {
	if (err) console.error('Shutting down server due to error', err)
	else console.log('Shutting down server due to signal', signal)

	await new Promise((resolve) => server.close(resolve))
	process.exit()
})
