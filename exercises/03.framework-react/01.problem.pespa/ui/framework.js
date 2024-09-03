import {
	createElement as h,
	createContext,
	useContext,
	useState,
	useMemo,
	useTransition,
} from 'react'

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

export function useFetcher() {
	const framework = useContext(FrameworkContext)
	const [isPending, startTransition] = useTransition()
	const [data, setData] = useState()

	const Form = useMemo(
		() =>
			function Form(props) {
				const framework = useContext(FrameworkContext)

				return h('form', {
					...props,
					onSubmit: async (event) => {
						startTransition(async () => {
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
								const data = await response.json()
								setData(data)
								await framework.revalidate()
							} else {
								console.error('Failed to update the count')
							}
						})
					},
				})
			},
		[],
	)

	return { Form, data, isPending }
}

export function useLoaderData() {
	const framework = useContext(FrameworkContext)
	return framework.data
}

export async function handleLoaderRequest(request) {
	const counter = await import('./counter.js')
	return counter.loader()
}

export async function handleActionRequest(request) {
	const counter = await import('./counter.js')
	return counter.action({ request })
}
