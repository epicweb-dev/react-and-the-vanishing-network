import { createElement as h } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Counter } from './counter.js'
import { FrameworkProvider } from './framework.js'

const initialData = window.__initialData

hydrateRoot(
	document.getElementById('root'),
	h(FrameworkProvider, { initialData }, h(Counter)),
)
