import { motion } from 'framer-motion';
import { Map, MapPin, Navigation, Globe, ArrowLeft, Camera, Bell, User } from 'lucide-react';
import UserDropdown from './UserDropdown';
import { useEffect, useRef } from 'react';

export default function MapPage({ goBack, goToProfile, goToSettings, goToNotifications, onSignOut, unreadCount, posts }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCKCvBfZPyFGMxx4MWQOZwVOGLeNcYJB2c`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [posts]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    // Create map centered on Europe (good view of Balkans)
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 44.0, lng: 18.0 }, // Center on Balkans region
      zoom: 6,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#746855' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }]
        }
      ]
    });

    googleMapRef.current = map;

    // Add markers for each post location
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        // You would need actual coordinates here
        // For now, using approximate coordinates for Balkan cities
        const cityCoords = getCityCoordinates(post.location || post.city);
        
        if (cityCoords) {
          const marker = new window.google.maps.Marker({
            position: cityCoords,
            map: map,
            title: post.title || post.caption,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          });

          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 200px;">
                <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${post.title || post.caption}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${post.location || post.city}</p>
                <p style="margin: 5px 0 0 0; font-size: 11px;">${post.user?.name || 'Anonymous'}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    }
  };

  const getCityCoordinates = (cityName) => {
    // Approximate coordinates for major Balkan cities
    const cityCoords = {
      'Sarajevo': { lat: 43.8563, lng: 18.4131 },
      'Dubrovnik': { lat: 42.6507, lng: 18.0944 },
      'Kotor': { lat: 42.4247, lng: 18.7712 },
      'Belgrade': { lat: 44.7866, lng: 20.4489 },
      'Zagreb': { lat: 45.8150, lng: 15.9819 },
      'Ljubljana': { lat: 46.0569, lng: 14.5058 },
      'Split': { lat: 43.5081, lng: 16.4402 },
      'Mostar': { lat: 43.3438, lng: 17.8078 }
    };

    return cityCoords[cityName] || null;
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

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
            <div 
              ref={mapRef}
              className="w-full h-[600px]"
              style={{ minHeight: '600px' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Location Pins</h4>
              <p className="text-blue-200 text-sm">
                Click on pins to see posts from specific locations
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Navigation className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Navigation</h4>
              <p className="text-blue-200 text-sm">
                Zoom and pan to explore different regions
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Globe className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">Global View</h4>
              <p className="text-blue-200 text-sm">
                Discover travel content from around the world
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
