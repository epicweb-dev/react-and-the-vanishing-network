import {
	createElement as h,
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from 'react'

const RouterContext = createContext(null)

export function Router({ children, initialLoaderData }) {
	const [loaderData, setLoaderData] = useState(initialLoaderData)
	const [, setUpdateKey] = useState(Symbol())

	const revalidate = useCallback(async () => {
		try {
			const url = new URL(window.location)
			const response = await fetch(`/${url.pathname}.data${url.search}`)
			if (response.ok) {
				const newData = await response.json()
				setLoaderData(newData)
			} else {
				console.error('Failed to fetch loader data')
			}
		} catch (error) {
			console.error('Error fetching loader data:', error)
		}
		setUpdateKey(Symbol())
	}, [])

	return h(
		RouterContext.Provider,
		{ value: { revalidate, loaderData } },
		children,
	)
}

export function Route({ children, path }) {
	const { loaderData } = useRouter()
	const routeData = loaderData[path] || {}
	return h('div', null, children(routeData))
}

export function useRouter() {
	const context = useContext(RouterContext)
	if (!context) {
		throw new Error('useRouter must be used within a Router')
	}
	return context
}
