import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider }     from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { BrandProvider }    from './contexts/BrandContext'
import { CustomerProvider } from './contexts/CustomerContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <BrandProvider>
            <CustomerProvider>
              <App />
            </CustomerProvider>
          </BrandProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
