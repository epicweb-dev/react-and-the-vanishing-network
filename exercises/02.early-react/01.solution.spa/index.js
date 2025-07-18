import fs from 'node:fs/promises'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import closeWithGrace from 'close-with-grace'
import { Hono } from 'hono'
import * as db from './db.js'

const PORT = Number(process.env.PORT ?? 3000)

const app = new Hono({ strict: true })

app.get('/count', async (c) => {
	const count = await db.getCount()
	return c.json({ count })
})

app.post('/update-count', async (c) => {
	const body = await c.req.json()
	const change = Number(body.change)
	const updatedCount = await db.changeCount(change)
	return c.json({ count: updatedCount })
})

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
		index: 'index.html',
	}),
)

app.get('*', async (c) => {
	const html = await fs.readFile('./public/index.html', 'utf8')
	return c.html(html, 200)
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
