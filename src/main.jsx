// Add BrandProvider INSIDE SettingsProvider (it reads from SettingsContext)
// Your main.jsx should look like this:

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CustomerProvider } from './contexts/CustomerContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { BrandProvider } from './contexts/BrandContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <BrandProvider>
          <CustomerProvider>
            <App />
          </CustomerProvider>
        </BrandProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
)
