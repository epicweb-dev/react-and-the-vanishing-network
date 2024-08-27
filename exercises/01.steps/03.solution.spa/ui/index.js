import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { Counter } from './counter.js'

document.addEventListener('DOMContentLoaded', () => {
	const root = createRoot(document.getElementById('root'))
	root.render(h(Counter))
})
