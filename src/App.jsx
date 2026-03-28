import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import SideBar from './components/SideBar/SideBar'
import Home from './pages/Home/Home'
import Customers from './pages/Customers/Customers'
import CustomerDetail from './pages/CustomerDetail/CustomerDetail'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Routes>
      {/* CustomerDetail is a full-screen standalone page — no global Header/Sidebar */}
      <Route path="/customers/:id" element={<CustomerDetail />} />

      {/* All other routes use the shared shell */}
      <Route path="*" element={
        <div className="app-shell">
          <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="app-content">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/customers"  element={<Customers />} />
            </Routes>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default App
