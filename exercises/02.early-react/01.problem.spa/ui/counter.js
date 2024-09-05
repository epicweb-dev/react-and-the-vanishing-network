import { createElement as h, useReducer, useEffect } from 'react'

function countReducer(state, action) {
	// 🐨 handle action types for "FETCH_START"/"UPDATE_START", "FETCH_SUCCESS"/"UPDATE_SUCCESS", and "FETCH_ERROR"/"UPDATE_ERROR"
	// 🦉 don't forget to throw an error on an incorrect action type!
	return state
}

export function Counter() {
	const [state, dispatch] = useReducer(countReducer, {
		count: null,
		loading: true,
		error: null,
	})

	// 🐨 use useEffect to fetch the count on component mount
	useEffect(() => {
		// 🐨 create and call an async fetchCount function to fetch the count from the server
		// 🦉 just ignore all the issues with race conditions etc. 🙄
	}, [])

	// 🐨 create an updateCount function that accepts a change to update the count on the server
	// 🦉 make certain to send the change as a JSON body with a content-type of application/json
	// 🐨 the JSON response includes the new count, which we should update the state with

	// 🐨 if the state is loading and the count is null, return a loading message
	// 🐨 if the state has an error, return an error message

	return h(
		'div',
		null,
		h('h1', null, 'Count: ' + state.count),
		// 🦉 notice we've deleted the form 😭
		h(
			'div',
			{ style: { opacity: state.loading ? 0.6 : 1 } },
			h('button', { onClick: () => updateCount(-1) }, 'Decrement'),
			h('button', { onClick: () => updateCount(1) }, 'Increment'),
		),
	)
}
