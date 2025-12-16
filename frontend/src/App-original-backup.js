import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from './api';
import { 
  Search, 
  Map, 
  Camera, 
  Heart, 
  MessageCircle, 
  Share2, 
  User, 
  Settings, 
  Menu, 
  X,
  Filter,
  Star,
  Navigation,
  Compass,
  Globe,
  Plus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Edit3,
  LogOut,
  MoreHorizontal,
  Upload,
  ArrowLeft,
  Bell,
  Home,
  AtSign,
  UserPlus,
  Check,
  MapPin
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const userData = {
    name: 'Travel Explorer',
    username: '@traveler',
    bio: 'Travel photographer & adventure seeker 🌍 Exploring the Balkans!',
    location: 'Sarajevo, Bosnia',
    joinDate: 'December 2025',
    followers: 0,
    following: 0,
    posts: posts.length
  };

  const popularDestinations = locations.flatMap(country => 
    country.cities?.map(city => ({
      id: city.city_id,
      name: city.city_name,
      country: country.country_name,
      image: `https://placehold.co/400x300/4f46e5/ffffff?text=${encodeURIComponent(city.city_name)}`,
      posts: 0,
      rating: 4.5,
      trending: true
    })) || []
  );

  const notifications = [
    {
      id: 1,
      type: 'like',
      user: {
        name: 'Sarah Chen',
        username: '@sarah_travels',
        avatar: 'https://placehold.co/40x40/ec4899/ffffff?text=SC'
      },
      postImage: 'https://placehold.co/200x200/4f46e5/ffffff?text=Santorini',
      postLocation: 'Santorini, Greece',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'follow',
      user: {
        name: 'Marco Rossi',
        username: '@marco_adventures',
        avatar: 'https://placehold.co/40x40/0ea5e9/ffffff?text=MR'
      },
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      user: {
        name: 'Emma Wilson',
        username: '@emma_wanders',
        avatar: 'https://placehold.co/40x40/10b981/ffffff?text=EW'
      },
      comment: 'This is absolutely stunning! Where exactly is this?',
      postImage: 'https://placehold.co/200x200/0ea5e9/ffffff?text=Machu+Picchu',
      postLocation: 'Machu Picchu, Peru',
      time: '1 day ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await api.posts.getAll();
        const formattedPosts = data.map(post => ({
          id: post.post_id,
          user: {
            name: post.username,
            username: `@${post.username}`,
            avatar: `https://placehold.co/40x40/4f46e5/ffffff?text=${post.username.charAt(0).toUpperCase()}`
          },
          image: post.image_url,
          caption: post.description,
          location: post.city,
          likes: 0,
          comments: 0,
          date: new Date(post.created_at).toLocaleDateString(),
          isLiked: false,
          title: post.title,
          price: post.price,
          googleMapsLink: post.google_maps_link
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentPage === 'home' || isAuthenticated) {
      fetchPosts();
    }
  }, [currentPage, isAuthenticated]);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.locations.getAll();
        setLocations(data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  // Handle splash screen animation
  useEffect(() => {
    if (currentPage === 'splash') {
      const timer1 = setTimeout(() => setShowLogo(true), 300);
      const timer2 = setTimeout(() => setShowText(true), 1500);
      const timer3 = setTimeout(() => setCurrentPage('login'), 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [currentPage]);

  // Navigation functions
  const goToHome = () => setCurrentPage('home');
  const goToLogin = () => setCurrentPage('login');
  const goToProfile = () => setCurrentPage('profile');
  const goToCreate = () => setCurrentPage('create');
  const goToFind = () => setCurrentPage('find');
  const goToNotifications = () => setCurrentPage('notifications');
  const goBack = () => {
    switch (currentPage) {
      case 'create':
      case 'find':
      case 'profile':
      case 'notifications':
        setCurrentPage('home');
        break;
      case 'login':
        setCurrentPage('splash');
        break;
      default:
        setCurrentPage('home');
    }
  };

  // Splash Screen
  if (currentPage === 'splash') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: showLogo ? 1 : 0.5, opacity: showLogo ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="w-full h-full relative">
                    <div className="absolute top-1/4 left-1/4 w-16 h-12 bg-orange-500 rounded-md transform rotate-12"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-12 h-16 bg-orange-500 rounded-md transform -rotate-15"></div>
                    <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-orange-500 rounded-md"></div>
                    <div className="absolute top-1/4 right-1/5 w-16 h-12 bg-orange-500 rounded-md"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-orange-500 rounded-md"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <div className="w-8 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <path 
                      d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="2"
                      strokeDasharray="10,10"
                    />
                    <circle cx="10" cy="50" r="4" fill="white" />
                    <circle cx="90" cy="50" r="4" fill="white" />
                    <circle cx="50" cy="10" r="4" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: showText ? 0 : 50, opacity: showText ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              <span className="text-blue-300">Travel</span>
              <span className="text-orange-300">Connect</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 font-light">
              Capture your journey. Share your world.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-12"
          >
            <div className="flex items-center justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                  className="w-3 h-3 bg-white rounded-full"
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-blue-200">Loading your travel adventure...</p>
          </motion.div>
        </div>
        
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>
      </div>
    );
  }

  // Login Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
        </div>
        
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-blue-300">Travel</span>
                <span className="text-orange-300">Connect</span>
              </h1>
              <p className="text-blue-200 mt-2">Join the global travel community</p>
            </div>

            <div className="flex mb-6 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isLogin
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isLogin
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              try {
                setLoading(true);
                setError(null);
                if (isLogin) {
                  await api.auth.login(loginEmail, loginPassword);
                } else {
                  await api.auth.signup(loginEmail, loginPassword);
                }
                setIsAuthenticated(true);
                goToHome();
              } catch (err) {
                setError(err.message);
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-white text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.1 : 0.2 }}
              >
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isLogin ? 0.2 : 0.3 }}
              >
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                    minLength="8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-200" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-200" />
                    )}
                  </button>
                </div>
              </motion.div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Create Post Page
  if (currentPage === 'create') {
    const handleSubmit = (e) => {
      e.preventDefault();
      if (selectedImage && caption.trim()) {
        goToHome();
        setSelectedImage(null);
        setCaption('');
        setLocation('');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
        </div>
        
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <button 
              onClick={goBack}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white">Create New Post</h2>
            <div className="w-10"></div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-white text-lg font-semibold">
                  Upload Photo
                </label>
                
                {selectedImage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center hover:border-white/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setSelectedImage(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-medium mb-2">Click to upload photo</p>
                      <p className="text-blue-200 text-sm">or drag and drop</p>
                    </label>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-white text-lg font-semibold">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell your story... What made this moment special? 🌍✨"
                  className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-white text-lg font-semibold">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-blue-200" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location (e.g., Santorini, Greece)"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!selectedImage || !caption.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Post</span>
                </div>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Find Page
  if (currentPage === 'find') {
    const filteredDestinations = popularDestinations.filter(destination => {
      const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           destination.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
        </div>
        
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <button 
              onClick={goBack}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white">Find Destinations</h2>
            <div className="w-10"></div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-8 border border-white/20"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, cities, or countries..."
                className="w-full pl-12 pr-12 py-4 bg-transparent border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-white text-lg font-semibold">
              {filteredDestinations.length} destinations found
              {searchQuery && ` for "${searchQuery}"`}
            </h3>
          </motion.div>

          {filteredDestinations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDestinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {destination.trending && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                        <p className="text-blue-200 flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{destination.country}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-white font-semibold">{destination.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-200">
                          <Camera className="w-4 h-4" />
                          <span className="text-sm">{destination.posts.toLocaleString()} posts</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2">
                      <Compass className="w-4 h-4" />
                      <span>Explore {destination.name}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No destinations found</h3>
              <p className="text-blue-200 text-lg">
                Try searching for different locations
              </p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Profile Page
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
        </div>
        
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-blue-300">Travel</span>
                  <span className="text-orange-300">Connect</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={goToLogin}
                className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white" />
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors">
                  <Edit3 className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{userData.name}</h2>
                    <p className="text-blue-200">{userData.username}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300"
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    defaultValue={userData.bio}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none mb-4"
                    rows="3"
                  />
                ) : (
                  <p className="text-blue-200 mb-4 leading-relaxed">{userData.bio}</p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <MapPin className="w-4 h-4" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-200">
                    <Navigation className="w-4 h-4" />
                    <span>Joined {userData.joinDate}</span>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start space-x-8 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userData.posts}</div>
                    <div className="text-blue-200 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userData.followers.toLocaleString()}</div>
                    <div className="text-blue-200 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{userData.following.toLocaleString()}</div>
                    <div className="text-blue-200 text-sm">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-1 bg-white/10 rounded-xl p-1 mb-8"
          >
            {['posts', 'likes', 'saved'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === 'posts'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={`Post ${post.id}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="flex items-center space-x-1 text-blue-200 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-blue-200 hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-blue-200 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-blue-200 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                  <p className="text-xs text-blue-300">{post.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // Notifications Page
  if (currentPage === 'notifications') {
    const getNotificationIcon = (type) => {
      switch (type) {
        case 'like':
          return <Heart className="w-5 h-5 text-red-400 fill-current" />;
        case 'follow':
          return <UserPlus className="w-5 h-5 text-blue-400" />;
        case 'comment':
          return <MessageCircle className="w-5 h-5 text-green-400" />;
        case 'mention':
          return <AtSign className="w-5 h-5 text-purple-400" />;
        default:
          return <Camera className="w-5 h-5 text-orange-400" />;
      }
    };

    const getNotificationText = (type, user) => {
      switch (type) {
        case 'like':
          return 'liked your post';
        case 'follow':
          return 'started following you';
        case 'comment':
          return 'commented on your post';
        case 'mention':
          return 'mentioned you in a post';
        default:
          return 'interacted with your content';
      }
    };

    const filteredNotifications = notifications.filter(notification => {
      if (activeTab === 'all') return true;
      return notification.type === activeTab;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
        </div>
        
        <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <button 
              onClick={goBack}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
            <div className="w-10"></div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {[
              { id: 'all', name: 'All', count: notifications.length },
              { id: 'like', name: 'Likes', count: notifications.filter(n => n.type === 'like').length },
              { id: 'follow', name: 'Follows', count: notifications.filter(n => n.type === 'follow').length },
              { id: 'comment', name: 'Comments', count: notifications.filter(n => n.type === 'comment').length }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveTab(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
                  activeTab === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                {getNotificationIcon(filter.id === 'all' ? 'like' : filter.id)}
                <span>{filter.name}</span>
                {filter.count > 0 && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    activeTab === filter.id ? 'bg-white/20 text-white' : 'bg-white/20 text-blue-200'
                  }`}>
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className={`bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 ${
                    !notification.read ? 'border-l-4 border-l-blue-400 bg-white/15' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={notification.user.avatar}
                          alt={notification.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {notification.user.name}
                          </p>
                          <p className="text-blue-200 text-sm truncate">
                            {notification.user.username}
                          </p>
                        </div>
                        <span className="text-blue-300 text-xs whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      
                      <p className="text-blue-200 text-sm mb-2">
                        {getNotificationText(notification.type, notification.user)}
                      </p>
                      
                      {notification.type === 'comment' && (
                        <p className="text-white text-sm bg-white/5 rounded-lg p-3 mb-2">
                          "{notification.comment}"
                        </p>
                      )}
                      
                      {notification.type === 'like' && notification.postImage && (
                        <div className="flex items-center space-x-2">
                          <img
                            src={notification.postImage}
                            alt="Post"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex items-center space-x-1 text-blue-200">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{notification.postLocation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <div className="flex flex-col space-y-1 ml-2">
                        <button className="p-1 text-green-400 hover:text-green-300 hover:bg-white/10 rounded-full transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {getNotificationIcon(activeTab)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No notifications</h3>
                <p className="text-blue-200 text-lg">
                  {activeTab === 'all' 
                    ? 'You\'re all caught up! Check back later for new activity.' 
                    : `No ${activeTab} notifications yet.`
                  }
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Home Page (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
      </div>
      
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

      <div className="max-w-6xl mx-auto px-4">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white hidden sm:block">
              <span className="text-blue-300">Travel</span>
              <span className="text-orange-300">Connect</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'explore'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'map'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>
            <button
              onClick={goToFind}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button 
              onClick={goToNotifications}
              className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={goToProfile}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            
            <button 
              className="md:hidden p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.header>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20"
          >
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setActiveTab('explore');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('map');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
              </button>
              <button
                onClick={() => {
                  goToFind();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </nav>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations, locations, or users..."
              className="w-full pl-12 pr-4 py-3 bg-transparent border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { id: 'all', name: 'All Posts', icon: Globe },
            { id: 'popular', name: 'Popular', icon: Star },
            { id: 'nearby', name: 'Nearby', icon: Navigation },
            { id: 'trending', name: 'Trending', icon: Compass }
          ].map((filter) => {
            const IconComponent = filter.icon;
            return (
              <button
                key={filter.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                <IconComponent className="w-4 h-4" />
                <span>{filter.name}</span>
              </button>
            );
          })}
        </motion.div>

        {activeTab === 'map' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl h-96 mb-6 border border-white/20 flex items-center justify-center"
          >
            <div className="text-center">
              <Map className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Interactive World Map</h3>
              <p className="text-blue-200">Click on locations to see posts from around the world</p>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading posts from database...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-red-400 text-lg mb-4">Error: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No posts yet</h3>
            <p className="text-blue-200 text-lg mb-6">Be the first to share your travel adventure!</p>
            <button 
              onClick={goToCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300"
            >
              Create Post
            </button>
          </div>
        )}

        <div className="space-y-6">
          {!loading && !error && posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{post.user.name}</h3>
                    <p className="text-blue-200 text-sm">{post.user.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-blue-200">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{post.location}</span>
                </div>
              </div>

              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-80 object-cover"
              />

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${
                      post.isLiked ? 'text-red-400' : 'text-blue-200 hover:text-red-400'
                    }`}>
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-white">{post.likes.toLocaleString()}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-blue-200 hover:text-white p-2 rounded-full transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-white">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-blue-200 hover:text-white p-2 rounded-full transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-white mb-2 leading-relaxed">{post.caption}</p>
                <p className="text-blue-300 text-sm">{post.date}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-8"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Load More Posts
          </button>
        </motion.div>

        {/* Floating Create Post Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToCreate}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}
