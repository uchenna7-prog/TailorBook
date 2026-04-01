import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RequireAuth from './components/RequireAuth/RequireAuth'
import SideBar     from './components/SideBar/SideBar'

// Pages
import Login          from './pages/Login/Login'
import Signup         from './pages/Signup/Signup'
import Home           from './pages/Home/Home'
import Customers      from './pages/Customers/Customers'
import CustomerDetail from './pages/CustomerDetail/CustomerDetail'
import Tasks          from './pages/Tasks/Tasks'
import Orders         from './pages/Orders/Orders'
import Gallery        from './pages/Gallery/Gallery'
import Settings       from './pages/Settings/Settings'
import Profile        from './pages/Profile/Profile'
import Contact        from './pages/Contact/Contact'
import FAQ            from './pages/FAQ/FAQ'

// ── All protected pages live here ─────────────────────────────
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const menuClick = () => setSidebarOpen(true)

  return (
    <>
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/"              element={<Home           onMenuClick={menuClick} />} />
        <Route path="/customers"     element={<Customers      onMenuClick={menuClick} />} />
        <Route path="/customers/:id" element={<CustomerDetail onMenuClick={menuClick} />} />
        <Route path="/tasks"         element={<Tasks          onMenuClick={menuClick} />} />
        <Route path="/orders"        element={<Orders         onMenuClick={menuClick} />} />
        <Route path="/gallery"       element={<Gallery        onMenuClick={menuClick} />} />
        <Route path="/settings"      element={<Settings       onMenuClick={menuClick} />} />
        <Route path="/profile"       element={<Profile        onMenuClick={menuClick} />} />
        <Route path="/contact"       element={<Contact        onMenuClick={menuClick} />} />
        <Route path="/faq"           element={<FAQ            onMenuClick={menuClick} />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

// ── Root — public routes + auth guard ────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Public — no auth needed */}
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Everything else requires a logged-in user */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
