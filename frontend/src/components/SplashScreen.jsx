import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { useTheme } from '../theme';

export default function SplashScreen({ showLogo, showText }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full h-screen flex items-center justify-center overflow-hidden relative ${
        isDark
          ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white'
          : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900'
      }`}
    >
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
          <h1 className={`text-5xl md:text-7xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className="text-blue-300">Travel</span>
            <span className="text-orange-300">Connect</span>
          </h1>
          <p className={`text-xl md:text-2xl font-light ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
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
          <p className={`mt-4 text-sm ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>Loading your travel adventure...</p>
        </motion.div>
      </div>
      
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>
    </div>
  );
}
