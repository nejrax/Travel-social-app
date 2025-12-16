import { motion } from 'framer-motion';
import { 
  Search, Map, Camera, Heart, MessageCircle, Share2, User, 
  Bell, Menu, X, Compass, Globe, Star, Navigation, MapPin, Plus
} from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function HomePage({ 
  posts, 
  loading, 
  error,
  activeTab, 
  setActiveTab,
  selectedFilter,
  setSelectedFilter,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  unreadCount,
  goToCreate,
  goToFind,
  goToProfile,
  goToNotifications,
  goToSettings,
  goToMap,
  onSignOut
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
      </div>
      
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-6 relative z-20"
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

          <nav className="hidden md:flex items-center space-x-8 relative z-30">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all relative z-30 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white/20 text-white'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => {
                console.log('Map button clicked, goToMap:', goToMap);
                if (goToMap) {
                  goToMap();
                } else {
                  console.error('goToMap is undefined!');
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all relative z-30 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
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
            <UserDropdown 
              goToProfile={goToProfile}
              goToSettings={goToSettings}
              onSignOut={onSignOut}
            />
            
            <button 
              className="md:hidden p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.header>

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
                  console.log('Mobile Map button clicked');
                  if (goToMap) {
                    goToMap();
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-all"
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
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
