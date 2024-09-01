import {
	Suspense,
	createElement as h,
	startTransition,
	use,
	useEffect,
	useRef,
	useState,
	useTransition,
} from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as RSC from 'react-server-dom-esm/client'

function updateContentPromise() {
	console.error('updateContentPromise called before it was set!')
}

function createFromFetch(fetchPromise) {
	return RSC.createFromFetch(fetchPromise, {
		moduleBaseURL: `${window.location.origin}/ui`,
		callServer,
	})
}

async function callServer(id, args) {
	const fetchPromise = fetch(`/action`, {
		method: 'POST',
		headers: { 'rsc-action': id },
		body: await RSC.encodeReply(args),
	})
	onStreamFinished(fetchPromise, () => {
		updateContentPromise(actionResponsePromise)
	})
	const actionResponsePromise = createFromFetch(fetchPromise)
	const { returnValue } = await actionResponsePromise
	return returnValue
}

const initialContentPromise = createFromFetch(fetch(`/rsc`))

function onStreamFinished(fetchPromise, onFinished) {
	// create a promise chain that resolves when the stream is completely consumed
	return (
		fetchPromise
			// clone the response so createFromFetch can use it (otherwise we lock the reader)
			// and wait for the text to be consumed so we know the stream is finished
			.then((response) => response.clone().text())
			.then(onFinished)
	)
}

function Root() {
	const [contentPromise, setContentPromise] = useState(initialContentPromise)

	useEffect(() => {
		updateContentPromise = (newContentPromise) => {
			startTransition(() => setContentPromise(newContentPromise))
		}
	}, [])

	return use(contentPromise).root
}

startTransition(() => {
	hydrateRoot(document.getElementById('root'), h(Root))
})
