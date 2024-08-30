import { Readable, Writable } from 'stream'
import { parentPort } from 'worker_threads'
import { createElement as h } from 'react'
import {
	renderToPipeableStream,
	decodeReply,
} from 'react-server-dom-esm/server'
import { Counter } from '../ui/counter.js'

const moduleBasePath = new URL('../ui', import.meta.url).href

async function renderApp(returnValue, requestId) {
	const root = h(Counter)
	const payload = { root, returnValue }
	return new Promise((resolve) => {
		const { pipe } = renderToPipeableStream(payload, moduleBasePath)
		const writable = new Writable({
			write(chunk, encoding, callback) {
				parentPort.postMessage({
					type: 'chunk',
					data: chunk.toString('utf-8'),
					requestId,
				})
				callback()
			},
		})
		writable.on('finish', () => {
			parentPort.postMessage({ type: 'end', requestId })
			resolve()
		})
		pipe(writable)
	})
}

parentPort.on('message', async (message) => {
	if (message.type === 'rsc') {
		await renderApp(null, message.requestId)
	} else if (message.type === 'action') {
		const [filepath, name] = message.serverReference.split('#')
		const action = (await import(filepath))[name]
		if (action.$$typeof !== Symbol.for('react.server.reference')) {
			throw new Error('Invalid action')
		}
		const formData = deserializeFormData(message.formData)
		const args = await decodeReply(formData, moduleBasePath)
		const result = await action(...args)
		await renderApp(result, message.requestId)
	}
})

function deserializeFormData(serialized) {
	const formData = new FormData()
	for (const [key, value] of Object.entries(serialized)) {
		if (value.type === 'file') {
			const file = new File([new Uint8Array(value.buffer)], value.name, {
				lastModified: value.lastModified,
			})
			formData.append(key, file)
		} else {
			formData.append(key, value.value)
		}
	}
	return formData
}
