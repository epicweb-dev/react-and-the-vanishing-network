import { createElement as h } from 'react'
import { useLoaderData, useFetcher } from './framework.js'

export function Counter() {
	const data = useLoaderData()
	const fetcher = useFetcher()

	return h(
		'div',
		{ style: { opacity: fetcher.isPending ? 0.6 : 1 } },
		h(
			fetcher.Form,
			{ method: 'POST' },
			h('h1', null, 'Count: ' + data.count),
			h('button', { type: 'submit', name: 'change', value: '-1' }, 'Decrement'),
			h('button', { type: 'submit', name: 'change', value: '1' }, 'Increment'),
		),
	)
}

export const server = {
	loader: async () => {
		const db = await import('../db.js')
		return { count: await db.getCount() }
	},
	action: async ({ request }) => {
		const db = await import('../db.js')
		const formData = await request.formData()
		const change = Number(formData.get('change'))
		await db.changeCount(change)
		return { success: true }
	},
}
