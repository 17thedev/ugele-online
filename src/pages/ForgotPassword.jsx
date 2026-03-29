import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password'
    })
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Ugele Online</h1>
        <p className="text-center text-gray-500 mb-8">Reset your password</p>

        {sent ? (
          <div className="text-center">
            <p className="text-green-700 font-semibold text-lg mb-4">Reset link sent!</p>
            <p className="text-gray-500 mb-6">Check your email and click the link to reset your password.</p>
            <Link to="/login" className="text-green-700 font-semibold">Back to Login</Link>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-800 transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p className="text-center text-gray-500 mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-green-700 font-semibold">Login here</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword