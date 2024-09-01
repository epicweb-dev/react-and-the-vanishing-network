import { createElement as h, useReducer, useEffect } from 'react'

const initialState = {
	count: null,
	loading: true,
	error: null,
}

function counterReducer(state, action) {
	switch (action.type) {
		case 'FETCH_START':
		case 'UPDATE_START': {
			return { ...state, loading: true, error: null }
		}
		case 'FETCH_SUCCESS':
		case 'UPDATE_SUCCESS': {
			return { ...state, count: action.payload, loading: false, error: null }
		}
		case 'FETCH_ERROR':
		case 'UPDATE_ERROR': {
			return { ...state, loading: false, error: action.payload }
		}
		default: {
			return state
		}
	}
}

export function Counter() {
	const [state, dispatch] = useReducer(counterReducer, initialState)

	useEffect(() => {
		async function fetchCount() {
			dispatch({ type: 'FETCH_START' })
			try {
				const response = await fetch('/count')
				if (!response.ok) throw new Error('Failed to fetch count')
				const data = await response.json()
				dispatch({ type: 'FETCH_SUCCESS', payload: data.count })
			} catch (err) {
				dispatch({ type: 'FETCH_ERROR', payload: err.message })
			}
		}

		fetchCount()
	}, [])

	async function updateCount(change) {
		dispatch({ type: 'UPDATE_START' })
		try {
			const response = await fetch('/update-count', {
				method: 'POST',
				body: new URLSearchParams({ change: String(change) }),
			})
			if (!response.ok) throw new Error('Failed to update count')
			const { count } = await response.json()
			dispatch({ type: 'UPDATE_SUCCESS', payload: count })
		} catch (err) {
			dispatch({ type: 'UPDATE_ERROR', payload: err.message })
		}
	}

	if (state.loading && state.count === null) return h('div', null, 'Loading...')
	if (state.error) return h('div', null, 'Error: ' + state.error)

	return h(
		'div',
		{ style: { opacity: state.loading ? 0.6 : 1 } },
		h('h1', null, 'Count: ' + state.count),
		h('button', { onClick: () => updateCount(-1) }, 'Decrement'),
		h('button', { onClick: () => updateCount(1) }, 'Increment'),
	)
}
