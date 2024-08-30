import { createElement as h, useRef } from 'react'
import { useRouter } from './router.js'

function Form({ action, method = 'GET', children }) {
	const { revalidate } = useRouter()

	async function handleSubmit(event) {
		event.preventDefault()
		const form = event.currentTarget

		const formData = new FormData(form)

		if (event.submitter) {
			formData.append(event.submitter.name, event.submitter.value)
		}
		const url = new URL(window.location)

		const actionUrl = form.action || `${url.pathname}${url.search}`
		const method = form.method
		const response = await fetch(actionUrl, {
			method: method,
			body: formData,
		})
		if (response.ok) {
			revalidate()
		} else {
			console.error('Failed to update the count')
		}
	}

	return h('form', { onSubmit: handleSubmit, action, method }, children)
}

export { Form }
