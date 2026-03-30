import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CustomerProvider } from './contexts/CustomerContext';
import { OrdersProvider } from './contexts/OrdersContext'; // ✅ import OrdersProvider
import App from './App.jsx';
import './index.css';
import { SettingsProvider } from './contexts/SettingsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
         <SettingsProvider>
      <CustomerProvider>
        <OrdersProvider> 
          <App />
        </OrdersProvider>
      </CustomerProvider>
         </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);