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
	const formData = await c.req.formData()
	const change = parseInt(formData.get('change'), 10)
	if (!isNaN(change)) {
		const currentCount = await db.getCount()
		const newCount = currentCount + change
		await db.setCount(newCount)
	}
	const updatedCount = await db.getCount()
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
		index: '',
		onNotFound: async (path, c) => {
			const html = await readFile('./public/index.html', 'utf8')
			return context.html(html, 200)
		},
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
