import { createElement as h, createContext, useContext, useState } from 'react'

export const FrameworkContext = createContext()

export function FrameworkProvider({ children, initialData }) {
	const [data, setData] = useState(initialData)

	async function revalidate() {
		const response = await fetch('/data')
		const data = await response.json()
		setData(data)
	}

	return h(FrameworkContext.Provider, { value: { revalidate, data } }, children)
}

export function Form(props) {
	const framework = useContext(FrameworkContext)

	return h('form', {
		...props,
		onSubmit: async (event) => {
			event.preventDefault()
			const form = event.currentTarget

			const formData = new FormData(form)

			const { submitter } = event.nativeEvent

			if (submitter) {
				formData.append(submitter.name, submitter.value)
			}

			const response = await fetch(form.action, {
				method: form.method,
				body: formData,
			})
			if (response.ok) {
				framework.revalidate()
			} else {
				console.error('Failed to update the count')
			}
		},
	})
}

export function useData() {
	const framework = useContext(FrameworkContext)
	return framework.data
}

export const server =
	typeof window === 'undefined'
		? {
				handleLoaderRequest: async (request) => {
					const counter = await import('./counter.js')
					return counter.server.loader()
				},
				handleActionRequest: async (request) => {
					const counter = await import('./counter.js')
					return counter.server.action({ request })
				},
			}
		: null
