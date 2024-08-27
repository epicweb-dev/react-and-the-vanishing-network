import { createElement as h } from 'react'
import { Form } from './form.js'
import { useRouter } from './router.js'

export function Counter() {
	const { loaderData } = useRouter()
	const count = loaderData.count

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + count),
		h(
			Form,
			{ method: 'POST' },
			h('button', { name: 'change', value: '-1' }, 'Decrement'),
			h('button', { name: 'change', value: '1' }, 'Increment'),
		),
	)
}
