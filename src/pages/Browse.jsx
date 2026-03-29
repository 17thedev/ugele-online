import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

const categories = [
  "All",
  "Accountant", "Lawyer", "Doctor/Nurse", "Event Planner", "Photographer", "Makeup Artist", "Tailor",
  "Plumber", "Electrician", "Carpenter", "Welder", "Painter", "Tiler", "Mason", "Generator Repair", "AC Repair", "Vulcanizer",
  "Cleaner", "Laundry", "Cook/Chef", "Nanny", "Security Guard", "Fumigation", "Waste Disposal",
  "Local Food Seller", "Restaurant", "Caterer", "Foodstuff Seller", "Provisions", "Livestock Seller", "Fresh Produce", "Fabric/Ankara Seller",
  "Graphic Designer", "Video Editor", "CV Writer", "Lesson Teacher", "Web Developer", "Data Analyst",
  "Dispatch Rider", "Truck Driver", "Keke/Taxi", "Haulage", "Moving/Relocation",
  "Social Media Manager", "Printer", "Signage Maker", "POS Agent", "Bulk SMS"
]

const Browse = () => {
  const [providers, setProviders] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider')
        .not('category', 'is', null)
      setProviders(data || [])
      setLoading(false)
    }
    fetchProviders()
  }, [])

  const filtered = providers.filter((p) => {
    return (
      (p.full_name || '').toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All' || p.category === category)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Ugele Online</Link>
        <div className="flex gap-4">
          <Link to="/login" className="bg-white text-green-700 px-4 py-2 rounded font-semibold">Login</Link>
          <Link to="/register" className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">Register</Link>
        </div>
      </nav>

      <div className="bg-green-700 py-10 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Find a Service Provider</h2>
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-gray-800"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-lg focus:outline-none text-gray-800"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="py-10 px-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading providers...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-2">No providers found yet.</p>
            <p className="text-gray-400 mb-6">Be the first to list your service!</p>
            <Link to="/register" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
              Register as a Provider
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">{filtered.length} providers found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((provider) => (
                <div key={provider.id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
                  <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    <span className="text-green-700 font-bold text-xl">{(provider.full_name || 'U')[0]}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{provider.full_name}</h3>
                  <p className="text-green-700 text-sm font-semibold mb-1">{provider.category}</p>
                  <p className="text-gray-500 text-sm mb-1">{provider.city}</p>
                  <p className="text-green-700 font-bold mb-4">From {provider.price}</p>
                  <Link to={"/provider/" + provider.id} className="block w-full bg-green-700 text-white text-center py-2 rounded-lg font-semibold hover:bg-green-800 transition">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Browse