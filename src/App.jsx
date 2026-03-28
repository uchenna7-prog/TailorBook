import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import SideBar from './components/SideBar/SideBar'
import Home from './pages/Home/Home'
import Customers from './pages/Customers/Customers'
import CustomerDetail from './pages/CustomerDetail/CustomerDetail'
import { CustomerProvider } from './contexts/CustomerContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <CustomerProvider>
      <div className="app-shell">
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="app-content">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/customers"         element={<Customers />} />
            <Route path="/customers/:id"     element={<CustomerDetail />} />
          </Routes>
        </div>
      </div>
    </CustomerProvider>
  )
}

export default App
