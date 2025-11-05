 /*import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
/*
// Mock data for locations
const mockLocations = {
  country: "Bosnia and Herzegovina",
  cities: [
    {
      name: "Sarajevo",
      categories: {
        shoppingCenters: ["SCC", "Alta", "Aria"],
        restaurants: ["Željo", "Park Prinčeva", "Metropolis"],
        famousPlaces: ["Baščaršija", "Vijećnica", "Avaz Tower"]
      }
    },
    {
      name: "Mostar",
      categories: {
        shoppingCenters: ["Rondo", "Cactus"],
        restaurants: ["Tima", "Šadrvan", "Kujundžiluk"],
        famousPlaces: ["Stari Most", "Koski Mehmed Paša Mosque", "Crooked Bridge"]
      }
    }
  ]
};

// Mock posts data
const mockPosts = [
  {
    id: 1,
    userId: "1",
    username: "traveler123",
    title: "Amazing view from Avaz Tower",
    description: "The panoramic view of Sarajevo from Avaz Tower is absolutely breathtaking! Perfect spot for sunset photos.",
    city: "Sarajevo",
    place: "Avaz Tower",
    imageUrl: "https://placehold.co/400x300/4F46E5/FFFFFF?text=Avaz+Tower",
    googleMapsLink: "https://maps.google.com/?q=Avaz+Tower",
    price: 10,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    userId: "2",
    username: "explorer456",
    title: "Traditional Bosnian cuisine",
    description: "Tried the best ćevapi at Željo restaurant. Highly recommend for authentic local food!",
    city: "Sarajevo",
    place: "Željo",
    imageUrl: "https://placehold.co/400x300/059669/FFFFFF?text=Bosnian+Food",
    googleMapsLink: "https://maps.google.com/?q=Željo+Sarajevo",
    price: 15,
    createdAt: "2024-01-12"
  },
  {
    id: 3,
    userId: "3",
    username: "wanderlust789",
    title: "Stari Most at sunset",
    description: "The Old Bridge in Mostar is even more magical during sunset. Don't miss the traditional diving ceremony!",
    city: "Mostar",
    place: "Stari Most",
    imageUrl: "https://placehold.co/400x300/DC2626/FFFFFF?text=Stari+Most",
    googleMapsLink: "https://maps.google.com/?q=Stari+Most+Mostar",
    price: 0,
    createdAt: "2024-01-10"
  }
];

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (mock implementation)
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ id: '1', username: 'traveler123', email: 'user@example.com' });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', 'mock-jwt-token');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  //const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Login Page
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Mock login
    login({ id: '1', username: 'traveler123', email });
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your TravelConnect account</p>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Signup Page
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with letters and numbers');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Mock signup
    setSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join TravelConnect to share your travel experiences</p>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters with letters and numbers
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Navigation Bar
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/explore" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-800">TravelConnect</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/explore" className="text-gray-600 hover:text-blue-600 font-medium">Explore</Link>
            <Link to="/locations" className="text-gray-600 hover:text-blue-600 font-medium">Locations</Link>
            <Link to="/create-post" className="text-gray-600 hover:text-blue-600 font-medium">Create Post</Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Explore Page
const Explore = () => {
  const [posts] = useState(mockPosts);
  const [filter, setFilter] = useState('');

  const filteredPosts = filter 
    ? posts.filter(post => 
        post.city.toLowerCase().includes(filter.toLowerCase()) ||
        post.place.toLowerCase().includes(filter.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Explore Travel Experiences</h1>
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by city or place..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-600">@{post.username}</span>
                  <span className="text-sm text-gray-500">{post.createdAt}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3">{post.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{post.city}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-600">{post.place}</span>
                  </div>
                  {post.price > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                      ${post.price}
                    </span>
                  )}
                </div>
                <a 
                  href={post.googleMapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                >
                  View on Google Maps
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Locations Page
const Locations = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Discover Locations</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{mockLocations.country}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockLocations.cities.map(city => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedCity === city.name 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-800">{city.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {Object.values(city.categories).flat().length} locations
                </p>
              </button>
            ))}
          </div>
        </div>

        {selectedCity && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Places in {selectedCity}</h2>
            <div className="space-y-6">
              {Object.entries(mockLocations.cities.find(c => c.name === selectedCity)?.categories || {}).map(([category, places]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {places.map(place => (
                      <div key={place} className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800 font-medium">{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Post Page
const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('Bosnia and Herzegovina');
  const [city, setCity] = useState('');
  const [place, setPlace] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [price, setPrice] = useState('');
 const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
   const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock post creation
    alert('Post created successfully!');
    navigate('/explore');
  };

  const cities = mockLocations.cities.map(city => city.name);
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Amazing sunset at Avaz Tower"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your travel experience..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              >
                <option>Bosnia and Herzegovina</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a city</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Place/Location</label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Avaz Tower, Baščaršija, etc."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Link</label>
            <input
              type="url"
              value={googleMapsLink}
              onChange={(e) => setGoogleMapsLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://maps.google.com/..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Price per Person (USD)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="15"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {previewUrl ? (
                <div className="space-y-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="mx-auto max-h-64 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreviewUrl('');
                    }}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <label className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                      Upload a file
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        required
                      />
                    </label>
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Page
const Profile = () => {
  const { user } = useAuth();
  const userPosts = mockPosts.filter(post => post.username === user?.username);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts ({userPosts.length})</h2>
          {userPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600">You haven't created any posts yet.</p>
              <Link 
                to="/create-post" 
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-3">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{post.city} • {post.place}</span>
                    {post.price > 0 && (
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                        ${post.price}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/explore" 
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/locations" 
              element={
                <ProtectedRoute>
                  <Locations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/explore" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
