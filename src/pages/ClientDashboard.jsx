import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const ClientDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)
      const { data: bookingData } = await supabase.from('bookings').select('*').eq('client_id', user.id)
      setBookings(bookingData || [])
    }
    getData()
  }, [])

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

      <div className="max-w-3xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Client Dashboard</h2>
        <p className="text-gray-500 mb-8">Welcome, {profile?.full_name} 👋</p>

        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">My Bookings</h3>
          {bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg mb-4">You have no bookings yet</p>
              <button onClick={() => navigate('/browse')} className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
                Find a Service Provider
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800 mb-1">{booking.message}</p>
                      <p className="text-gray-500 text-sm">📞 {booking.client_phone}</p>
                    </div>
                    <span className={"px-3 py-1 rounded-full text-sm font-semibold " + (booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => navigate('/browse')} className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition">
          Browse More Services
        </button>
      </div>
    </div>
  )
}

export default ClientDashboard