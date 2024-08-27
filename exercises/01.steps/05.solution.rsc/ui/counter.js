import { createElement as h } from 'react'
import * as db from '../db.js'
import * as actions from './actions.js'

export async function Counter() {
	const count = await db.getCount()

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + count),
		h(
			'form',
			{ action: actions.updateCount },
			h('button', { type: 'submit', name: 'change', value: -1 }, 'Decrement'),
			h('button', { type: 'submit', name: 'change', value: 1 }, 'Increment'),
		),
	)
}
