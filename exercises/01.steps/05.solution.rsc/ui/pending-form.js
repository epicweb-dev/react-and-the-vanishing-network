'use client'

import { createElement as h } from 'react'
import { useFormStatus } from 'react-dom'

export function PendingDiv(props) {
	const { pending } = useFormStatus()

	return h('div', { style: { opacity: pending ? 0.6 : 1 }, ...props })
}
