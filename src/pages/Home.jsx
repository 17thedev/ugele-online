import { useNavigate } from 'react-router-dom'

const categories = [
  { name: "Plumber", icon: "🔧" },
  { name: "Electrician", icon: "⚡" },
  { name: "Carpenter", icon: "🪚" },
  { name: "Welder", icon: "🔩" },
  { name: "Accountant", icon: "📊" },
  { name: "Lawyer", icon: "⚖️" },
  { name: "Dispatch Rider", icon: "🏍️" },
  { name: "Local Food Seller", icon: "🍛" },
  { name: "Caterer", icon: "🍽️" },
  { name: "Cleaner", icon: "🧹" },
  { name: "Tailor", icon: "🧵" },
  { name: "Photographer", icon: "📸" },
  { name: "Graphic Designer", icon: "🎨" },
  { name: "Lesson Teacher", icon: "📚" },
  { name: "Makeup Artist", icon: "💄" },
  { name: "Livestock Seller", icon: "🐄" },
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ugele Online</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="bg-white text-green-700 px-4 py-2 rounded font-semibold">Login</button>
          <button onClick={() => navigate('/register')} className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold">Register</button>
        </div>
      </nav>

      <div className="bg-green-50 py-20 text-center px-6">
        <h2 className="text-4xl font-bold text-green-800 mb-4">Find Trusted Services Near You</h2>
        <p className="text-gray-600 text-lg mb-8">Connect with verified local service providers across Africa</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/browse')} className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg">Find a Service</button>
          <button onClick={() => navigate('/register')} className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold text-lg">List Your Business</button>
        </div>
      </div>

      <div className="py-16 px-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">Browse Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <div key={cat.name} onClick={() => navigate('/browse')} className="bg-green-50 border border-green-200 rounded-xl p-6 text-center cursor-pointer hover:bg-green-100 transition">
              <p className="text-3xl mb-2">{cat.icon}</p>
              <p className="font-semibold text-green-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-700 py-16 px-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Are you a service provider?</h3>
        <p className="text-green-100 mb-8">Join thousands of providers already on Ugele Online</p>
        <button onClick={() => navigate('/register')} className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold text-lg">Join Now — It's Free</button>
      </div>
    </div>
  )
}

export default Home