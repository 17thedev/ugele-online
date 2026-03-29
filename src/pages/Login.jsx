import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    navigate('/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Ugele Online</h1>
        <p className="text-center text-gray-500 mb-8">Login to your account</p>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <p className="text-right mb-6">
          <Link to="/forgot-password" className="text-green-700 font-semibold text-sm">Forgot password?</Link>
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-800 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-700 font-semibold">Register here</Link>
        </p>

      </div>
    </div>
  )
}

export default Login