import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './app/App'
import './styles/index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Elemento #root no encontrado')
}

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
)

