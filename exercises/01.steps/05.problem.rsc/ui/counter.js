// 🐨 add 'use server' to this file so a reference to the action can be sent to the client

import { createElement as h } from 'react'
// 💰 you'll want this
// import * as db from '../db.js'
import { PendingDiv } from './pending-form.js'

export async function updateCount(formData) {
	try {
		const change = Number(formData.get('change'))
		// 🐨 call db.changeCount with the change
		return { status: 'success', message: 'Success!' }
	} catch (error) {
		return { status: 'error', message: error?.message || String(error) }
	}
}

export async function Counter() {
	// 🐨 get the count from the database
	const count = 0

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + count),
		h(
			'form',
			{ action: updateCount },
			h(
				// 🐨 swap this out for PendingDiv
				'div',
				null,
				h('button', { type: 'submit', name: 'change', value: -1 }, 'Decrement'),
				h('button', { type: 'submit', name: 'change', value: 1 }, 'Increment'),
			),
		),
	)
}
