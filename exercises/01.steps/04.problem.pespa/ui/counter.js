import { createElement as h } from 'react'
import { useLoaderData, useFetcher } from './framework.js'

export async function loader() {
	// 🐨 dynamically import the db module (so it doesn't show up on the client)
	// 🐨 return the count from the database
	return { count: 'TODO' }
}

export async function action({ request }) {
	// 🐨 dynamically import the db module (so it doesn't show up on the client)
	// 🐨 parse the form data
	// 🐨 get the change from the form data and turn it into a number
	// 🐨 update the count in the database
	// 🐨 return the success status
	return { success: true }
}

export function Counter() {
	// 🐨 use the useLoaderData hook to get the data from the loader
	const data = { count: 'TODO' }
	// 🐨 use the useFetcher hook to get the fetcher from the framework
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
