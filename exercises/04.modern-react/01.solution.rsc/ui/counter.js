'use server'

import { createElement as h } from 'react'
import * as db from '../db.js'
import { PendingDiv } from './pending-form.js'

export async function updateCount(formData) {
	try {
		const change = Number(formData.get('change'))
		await db.changeCount(change)
		return { status: 'success', message: 'Success!' }
	} catch (error) {
		return { status: 'error', message: error?.message || String(error) }
	}
}

export async function Counter() {
	const count = await db.getCount()

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + count),
		h(
			'form',
			{ action: updateCount },
			h(
				PendingDiv,
				null,
				h('button', { type: 'submit', name: 'change', value: -1 }, 'Decrement'),
				h('button', { type: 'submit', name: 'change', value: 1 }, 'Increment'),
			),
		),
	)
}
