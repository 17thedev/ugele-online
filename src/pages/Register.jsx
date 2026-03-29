import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill in all fields')
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        role: role,
      })
      if (profileError) {
        alert('Profile error: ' + profileError.message)
        setLoading(false)
        return
      }
    }
    alert('Account created! Please check your email to confirm.')
    navigate('/login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">Ugele Online</h1>
        <p className="text-center text-gray-500 mb-8">Create your account</p>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">I am registering as</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          >
            <option value="client">A Business (I need services)</option>
            <option value="provider">A Service Provider (I offer services)</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register