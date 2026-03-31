import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SideBar from './components/SideBar/SideBar'
import Home from './pages/Home/Home'
import Customers from './pages/Customers/Customers'
import CustomerDetail from './pages/CustomerDetail/CustomerDetail'
import Tasks from './pages/Tasks/Tasks'
import Orders from './pages/Orders/Orders'
import Gallery from './pages/Gallery/Gallery'
import Settings from './pages/Settings/Settings'
import Profile from './pages/Profile/Profile'
import Contact from './pages/Contact/Contact'
import FAQ from './pages/FAQ/FAQ'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuClick = () => setSidebarOpen(true)

  return (
    <>
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Routes>
        <Route path="/"              element={<Home           onMenuClick={menuClick} />} />
        <Route path="/faq" element={<FAQ onMenuClick={menuClick} />} />
        <Route path="/contact" element={<Contact onMenuClick={menuClick} />} />
        <Route path="/customers"     element={<Customers      onMenuClick={menuClick} />} />
        <Route path="/customers/:id" element={<CustomerDetail onMenuClick={menuClick} />} />
        <Route path="/tasks"         element={<Tasks          onMenuClick={menuClick} />} />
        <Route path="/orders"        element={<Orders         onMenuClick={menuClick} />} />
        <Route path="/gallery"       element={<Gallery        onMenuClick={menuClick} />} />
        <Route path="/settings"      element={<Settings       onMenuClick={menuClick} />} />
        <Route path="/profile"       element={<Profile        onMenuClick={menuClick} />} />
      </Routes>
    </>
  )
}

export default App
