import { motion } from 'framer-motion';
import { Map, MapPin, Navigation, Globe, ArrowLeft, Camera, Bell, User } from 'lucide-react';
import UserDropdown from './UserDropdown';

export default function MapPage({ goBack, goToProfile, goToSettings, goToNotifications, onSignOut, unreadCount }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
      </div>
      
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-6"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={goBack}
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white hidden sm:block">
                <span className="text-blue-300">Travel</span>
                <span className="text-orange-300">Connect</span>
              </h1>
            </div>
          </div>

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
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">
              Explore the World Map
            </h2>
            <p className="text-blue-200 text-lg">
              Discover travel destinations and posts from around the globe
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 min-h-[600px] flex flex-col items-center justify-center">
            <Map className="w-24 h-24 text-blue-300 mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-3">Interactive World Map</h3>
            <p className="text-blue-200 text-center max-w-md mb-6">
              This feature is coming soon! You'll be able to explore posts by location, 
              see trending destinations, and discover new places to visit.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Location Pins</h4>
                <p className="text-blue-200 text-sm">
                  See posts from specific locations on the map
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <Navigation className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Navigation</h4>
                <p className="text-blue-200 text-sm">
                  Navigate to different regions and countries
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                <Globe className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="text-white font-semibold mb-2">Global View</h4>
                <p className="text-blue-200 text-sm">
                  Explore travel content from around the world
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
