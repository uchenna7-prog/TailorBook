import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CustomerProvider } from './contexts/CustomerContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CustomerProvider>
        <App />
      </CustomerProvider>
    </BrowserRouter>
  </StrictMode>
)
