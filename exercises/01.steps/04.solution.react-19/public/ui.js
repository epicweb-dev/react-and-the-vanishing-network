import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './router.js'
import { Counter } from './index.js'

const initialLoaderData = window.__initialLoaderData__

const root = createRoot(document.getElementById('root'))
root.render(h(Router, { initialLoaderData }, h(Counter)))
