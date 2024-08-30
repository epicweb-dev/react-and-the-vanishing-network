import { createElement as h, useReducer, useEffect } from 'react'

// 🐨 create the initial state with count, loading, and error

// 🐨 create the counterReducer for handling action types "FETCH_START", "FETCH_SUCCESS", "FETCH_ERROR", "UPDATE_START", "UPDATE_SUCCESS", "UPDATE_ERROR"

export function Counter() {
	// 🐨 use useReducer with the counterReducer and initialState
	const [state, dispatch] = useReducer(counterReducer, initialState)

	// 🐨 use useEffect to fetch the count on component mount

	useEffect(() => {
		// 🐨 create and call the fetchCount function to fetch the count from the server
		// 🦉 just ignore all the issues with race conditions etc. 🙄
		// 🐨 call fetchCount
	}, [])

	// 🐨 create an updateCount function that accepts a change to update the count on the server
	// 🐨 the response includes the new count, which we should update the state with

	// 🐨 if the state is loading, return a loading message
	// 🐨 if the state has an error, return an error message

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + state.count),
		h('button', { onClick: () => updateCount(-1) }, 'Decrement'),
		h('button', { onClick: () => updateCount(1) }, 'Increment'),
	)
}
