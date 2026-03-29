import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabase'

const ProviderProfile = () => {
  const { id } = useParams()
  const [provider, setProvider] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProvider = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()
      setProvider(data)
    }
    fetchProvider()
  }, [id])

  const handleBooking = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('bookings').insert({
      client_name: name,
      client_phone: phone,
      message: message,
      status: 'pending',
      client_id: user ? user.id : null,
      provider_id: id,
    })
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Booking request sent!')
      setName('')
      setPhone('')
      setMessage('')
    }
    setLoading(false)
  }

  if (!provider) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading provider...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Ugele Online</Link>
        <div className="flex gap-4">
          <Link to="/login" className="bg-white text-green-700 px-4 py-2 rounded font-semibold">Login</Link>
          <Link to="/register" className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">Register</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
              <span className="text-green-700 font-bold text-3xl">{(provider.full_name || 'U')[0]}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{provider.full_name}</h2>
              <p className="text-green-700 font-semibold">{provider.category}</p>
              <p className="text-gray-500">{provider.city}</p>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600">{provider.bio || 'No description provided yet.'}</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Pricing</h3>
            <p className="text-green-700 font-bold text-2xl">From {provider.price || 'Contact for price'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Send a Booking Request</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Your Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Describe what you need</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell the provider what you need..." rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"></textarea>
          </div>
          <button onClick={handleBooking} disabled={loading} className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition">
            {loading ? 'Sending...' : 'Send Booking Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProviderProfile