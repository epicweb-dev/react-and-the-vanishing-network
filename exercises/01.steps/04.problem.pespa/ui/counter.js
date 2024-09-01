import { createElement as h } from 'react'
import { useLoaderData, useFetcher } from './framework.js'

export function Counter() {
	// 🐨 use the useLoaderData hook to get the data from the loader
	// 🐨 use the useFetcher hook to get the fetcher from the framework
	const data = { count: 'TODO' }
	return h(
		'div',
		null,
		h(
			'form', // 🐨 switch this to a fetcher.Form
			{ method: 'POST' },
			h('h1', null, 'Count: ' + data.count),
			h(
				'div',
				// 🐨 update this to use the fetcher.isPending property
				{ style: { opacity: false ? 0.6 : 1 } },
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

export const server = {
	loader: async () => {
		const db = await import('../db.js')
		// 🐨 return the count from the database
		return { count: 'TODO' }
	},
	action: async ({ request }) => {
		// 🐨 parse the form data
		// 🐨 get the change from the form data
		// 🐨 update the count in the database
		// 🐨 return the success status
		return { success: true }
	},
}
