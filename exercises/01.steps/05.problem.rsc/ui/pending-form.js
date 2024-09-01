// 🐨 add 'use client' to this file so the reference to useFormStatus can be sent to the client

import { createElement as h } from 'react'
// 💰 you'll want this
// import { useFormStatus } from 'react-dom'

export function PendingDiv(props) {
	// 🐨 get the pending status from useFormStatus
	const pending = false

	return h('div', { style: { opacity: pending ? 0.6 : 1 }, ...props })
}
