import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Browse from './pages/Browse'
import ProviderProfile from './pages/ProviderProfile'
import ProviderDashboard from './pages/ProviderDashboard'
import ClientDashboard from './pages/ClientDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App