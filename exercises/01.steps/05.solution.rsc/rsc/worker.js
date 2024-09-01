import { Readable, Writable } from 'stream'
import { parentPort } from 'worker_threads'
import { createElement as h } from 'react'
import {
	renderToPipeableStream,
	decodeReply,
	decodeAction,
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

async function handleMessage(message) {
	if (message.type === 'rsc') {
		await renderApp(null, message.requestId)
	} else if (message.type === 'action') {
		const formData = deserializeFormData(message.formData)
		if (message.serverReference) {
			const [filepath, name] = message.serverReference.split('#')
			const action = (await import(filepath))[name]
			if (!action) {
				throw new Error(`No action found at ${message.serverReference}`)
			}
			if (action.$$typeof !== Symbol.for('react.server.reference')) {
				throw new Error('Invalid action')
			}

			const args = await decodeReply(formData, moduleBasePath)
			const result = await action(...args)
			await renderApp(result, message.requestId)
		} else {
			const action = await decodeAction(formData, moduleBasePath)
			if (!action) {
				console.error(formData)
				throw new Error('No action found from formData')
			}
			await action()
			await renderApp(null, message.requestId)
		}
	}
}

parentPort.on('message', async (message) => {
	try {
		const result = await handleMessage(message)
		return result
	} catch (error) {
		console.error(error)
		parentPort.postMessage({
			type: 'error',
			error: error.message,
			requestId: message.requestId,
		})
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
