import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PlanesProvider } from './store/planesStore.jsx'
import { AlertasProvider } from './store/alertasStore.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <PlanesProvider>
          <AlertasProvider>
            <App />
          </AlertasProvider>
        </PlanesProvider>
    </BrowserRouter>
  </StrictMode>
)
