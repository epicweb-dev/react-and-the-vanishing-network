import { createElement as h, useState, Suspense, use } from 'react'

const initialCountPromise = fetch('/count').then((r) => r.json())

export function Counter() {
	const [count, setCount] = useState(use(initialCountPromise).count)

	async function updateCount(change) {
		const response = await fetch('/update-count', {
			method: 'POST',
			body: new URLSearchParams({ change: String(change) }),
		})
		if (response.ok) {
			const { count } = await response.json()
			setCount(count)
		} else {
			console.error('Failed to update the count')
		}
	}

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + count),
		h('button', { onClick: () => updateCount(-1) }, 'Decrement'),
		h('button', { onClick: () => updateCount(1) }, 'Increment'),
	)
}
