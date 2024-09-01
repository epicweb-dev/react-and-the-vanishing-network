import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { Counter } from './counter.js'

const root = createRoot(document.getElementById('root'))
root.render(h(Counter))
