import { createElement as h, useRef } from 'react'
import { useRouter } from './router.js'

function Form({ action, method = 'GET', children }) {
	const { revalidate } = useRouter()
	const formRef = useRef(null)

	async function handleSubmit(event) {
		event.preventDefault()

		const formData = new FormData(form)

		if (event.submitter) {
			formData.append(event.submitter.name, event.submitter.value)
		}
		const url = new URL(window.location)

		const actionUrl =
			form.getAttribute('action') || `${url.pathname}${url.search}`
		const method = form.getAttribute('method')
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

	return h(
		'form',
		{ ref: formRef, onSubmit: handleSubmit, action, method },
		children,
	)
}

export { Form }
