import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const ProviderDashboard = () => {
  const [profile, setProfile] = useState(null)
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [service, setService] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setBio(data.bio || '')
        setPhone(data.phone || '')
        setCity(data.city || '')
        setService(data.category || '')
        setPrice(data.price || '')
      }
    }
    getProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ bio, phone, city, category: service, price }).eq('id', user.id)
    alert('Profile updated!')
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ugele Online</h1>
        <button onClick={handleLogout} className="bg-white text-green-700 px-4 py-2 rounded font-semibold">Logout</button>
      </nav>

      <div className="max-w-2xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Provider Dashboard</h2>
        <p className="text-gray-500 mb-8">Welcome back!</p>

        <div className="bg-white rounded-2xl shadow p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Update Your Profile</h3>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Service Category</label>
            <select value={service} onChange={(e) => setService(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500">
              <option value="">Select a category</option>
              <optgroup label="Professional Services">
                <option>Accountant</option>
                <option>Lawyer</option>
                <option>Doctor/Nurse</option>
                <option>Event Planner</option>
                <option>Photographer</option>
                <option>Makeup Artist</option>
                <option>Tailor</option>
              </optgroup>
              <optgroup label="Trades & Handwork">
                <option>Plumber</option>
                <option>Electrician</option>
                <option>Carpenter</option>
                <option>Welder</option>
                <option>Painter</option>
                <option>Tiler</option>
                <option>Mason</option>
                <option>Generator Repair</option>
                <option>AC Repair</option>
                <option>Vulcanizer</option>
              </optgroup>
              <optgroup label="Home Services">
                <option>Cleaner</option>
                <option>Laundry</option>
                <option>Cook/Chef</option>
                <option>Nanny</option>
                <option>Security Guard</option>
                <option>Fumigation</option>
                <option>Waste Disposal</option>
              </optgroup>
              <optgroup label="Food & Market">
                <option>Local Food Seller</option>
                <option>Restaurant</option>
                <option>Caterer</option>
                <option>Foodstuff Seller</option>
                <option>Provisions</option>
                <option>Livestock Seller</option>
                <option>Fresh Produce</option>
                <option>Fabric/Ankara Seller</option>
              </optgroup>
              <optgroup label="Students & Digital Skills">
                <option>Graphic Designer</option>
                <option>Video Editor</option>
                <option>CV Writer</option>
                <option>Lesson Teacher</option>
                <option>Web Developer</option>
                <option>Data Analyst</option>
              </optgroup>
              <optgroup label="Logistics & Transport">
                <option>Dispatch Rider</option>
                <option>Truck Driver</option>
                <option>Keke/Taxi</option>
                <option>Haulage</option>
                <option>Moving/Relocation</option>
              </optgroup>
              <optgroup label="Business Support">
                <option>Social Media Manager</option>
                <option>Printer</option>
                <option>Signage Maker</option>
                <option>POS Agent</option>
                <option>Bulk SMS</option>
              </optgroup>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Starting Price (₦)</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 5000" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500" />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">About You</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Describe your services..." rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"></textarea>
          </div>

          <button onClick={handleSave} disabled={loading} className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-800 transition">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard