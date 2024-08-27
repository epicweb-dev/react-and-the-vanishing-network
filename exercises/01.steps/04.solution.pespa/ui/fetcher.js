import { createElement as h, useState, useEffect, useRef } from 'react'

export function Form({ action, method = 'post', children, ...props }) {
	const [state, setState] = useState('idle')
	const formRef = useRef(null)

	async function handleSubmit(event) {
		event.preventDefault()
		setState('submitting')

		const formData = new FormData(event.currentTarget)
		if (event.nativeEvent.submitter) {
			const submitter = event.nativeEvent.submitter
			formData.append(submitter.name, submitter.value)
		}

		try {
			const response = await fetch(action, {
				method,
				body: formData,
			})

			if (response.ok) {
				setState('success')
			} else {
				setState('error')
			}
		} catch (error) {
			setState('error')
		}
	}

	return h(
		'form',
		{
			ref: formRef,
			action,
			method,
			onSubmit: handleSubmit,
			...props,
		},
		children,
	)
}

export function useFetcher() {
	const [state, setState] = useState('idle')
	const [data, setData] = useState(null)

	const submit = async (formData, { method, action }) => {
		setState('submitting')

		try {
			const response = await fetch(action, {
				method,
				body: formData,
			})

			if (response.ok) {
				const responseData = await response.json()
				setData(responseData)
				setState('success')
			} else {
				setState('error')
			}
		} catch (error) {
			setState('error')
		}
	}

	return {
		state,
		data,
		submit,
	}
}
