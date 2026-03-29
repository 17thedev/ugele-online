import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleReset = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Password updated successfully!')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Ugele Online</h1>
        <p className="text-center text-gray-500 mb-8">Set your new password</p>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-800 transition"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}

export default ResetPassword