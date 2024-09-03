import { createElement as h } from 'react'
import { useLoaderData, useFetcher } from './framework.js'

export async function loader() {
	const db = await import('../db.js')
	return { count: await db.getCount() }
}

export async function action({ request }) {
	const db = await import('../db.js')
	const formData = await request.formData()
	const change = Number(formData.get('change'))
	await db.changeCount(change)
	return { success: true }
}

export function Counter() {
	const data = useLoaderData()
	const fetcher = useFetcher()

	return h(
		'div',
		null,
		h(
			fetcher.Form,
			{ method: 'POST' },
			h('h1', null, 'Count: ' + data.count),
			h(
				'div',
				{ style: { opacity: fetcher.isPending ? 0.6 : 1 } },
				h(
					'button',
					{ type: 'submit', name: 'change', value: '-1' },
					'Decrement',
				),
				h(
					'button',
					{ type: 'submit', name: 'change', value: '1' },
					'Increment',
				),
			),
		),
	)
}
