import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../theme';

export default function FindPage({ goBack }) {
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white'
          : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900'
      }`}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 pb-20">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-6"
        >
          <button
            onClick={goBack}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'text-blue-200 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Find</h1>
          <div className="w-10" />
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`backdrop-blur-lg rounded-2xl p-4 border ${
            isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-black/10'
          }`}
        >
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-blue-200' : 'text-slate-500'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations..."
              className={`w-full pl-12 pr-4 py-4 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-lg ${
                isDark
                  ? 'border border-white/20 text-white placeholder-blue-200'
                  : 'border border-black/10 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div className={`mt-6 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
            Search is coming soon.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
