import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  ArrowLeft, Lock, Bell, Globe, Eye, Shield, HelpCircle, 
  LogOut, ChevronRight, Moon, Sun, Smartphone, Mail, Key,
  UserX, Download, Trash2, AlertCircle
} from 'lucide-react';

export default function SettingsPage({ goBack, onSignOut, user }) {
  const [activeSection, setActiveSection] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      emailNotifications: false
    },
    privacy: {
      privateAccount: false,
      showActivity: true,
      allowTagging: true,
      allowMentions: true
    },
    theme: 'dark'
  });

  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setSettings(prev => ({ ...prev, theme: savedTheme }));
      document.body.dataset.theme = savedTheme;
    } else {
      document.body.dataset.theme = settings.theme;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', settings.theme);
    document.body.dataset.theme = settings.theme;
  }, [settings.theme]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleToggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    try {
      // API call to change password would go here
      alert('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveSection(null);
    } catch (err) {
      alert('Failed to change password');
    }
  };

  const settingsSections = [
    {
      id: 'account',
      title: 'Account',
      icon: Shield,
      items: [
        { id: 'email', label: 'Email', value: user?.email, icon: Mail },
        { id: 'password', label: 'Change Password', icon: Key, action: () => setActiveSection('password') },
        { id: 'username', label: 'Username', value: `@${user?.username}`, icon: Smartphone }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { id: 'likes', label: 'Likes', toggle: true, value: settings.notifications.likes },
        { id: 'comments', label: 'Comments', toggle: true, value: settings.notifications.comments },
        { id: 'follows', label: 'New Followers', toggle: true, value: settings.notifications.follows },
        { id: 'messages', label: 'Messages', toggle: true, value: settings.notifications.messages },
        { id: 'emailNotifications', label: 'Email Notifications', toggle: true, value: settings.notifications.emailNotifications }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        { id: 'privateAccount', label: 'Private Account', toggle: true, value: settings.privacy.privateAccount },
        { id: 'showActivity', label: 'Show Activity Status', toggle: true, value: settings.privacy.showActivity },
        { id: 'allowTagging', label: 'Allow Tagging', toggle: true, value: settings.privacy.allowTagging },
        { id: 'allowMentions', label: 'Allow Mentions', toggle: true, value: settings.privacy.allowMentions }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: settings.theme === 'dark' ? Moon : Sun,
      items: [
        { id: 'theme', label: 'Theme', value: settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode', icon: settings.theme === 'dark' ? Moon : Sun, action: handleToggleTheme }
      ]
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { id: 'faq', label: 'FAQ', icon: HelpCircle, action: () => setActiveSection('faq') },
        { id: 'contact', label: 'Contact Support', icon: Mail, action: () => setActiveSection('contact') },
        { id: 'about', label: 'About TravelConnect', icon: Globe, action: () => setActiveSection('about') }
      ]
    },
    {
      id: 'data',
      title: 'Data & Storage',
      icon: Download,
      items: [
        { id: 'download', label: 'Download Your Data', icon: Download },
        { id: 'clear', label: 'Clear Cache', icon: Trash2 }
      ]
    }
  ];

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
      
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>

      <div className="max-w-3xl mx-auto px-4 relative z-10 pb-20">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between py-6"
        >
          <div className="flex items-center space-x-4">
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
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
          </div>
        </motion.header>

        {activeSection === 'password' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`backdrop-blur-lg rounded-2xl p-6 border ${
              isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-black/10'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Change Password</h2>
              <button
                onClick={() => setActiveSection(null)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? 'text-blue-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark
                      ? 'bg-white/10 border border-white/20 text-white placeholder-blue-300'
                      : 'bg-white border border-black/10 text-slate-900 placeholder-slate-400'
                  }`}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark
                      ? 'bg-white/10 border border-white/20 text-white placeholder-blue-300'
                      : 'bg-white border border-black/10 text-slate-900 placeholder-slate-400'
                  }`}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-slate-700'}`}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isDark
                      ? 'bg-white/10 border border-white/20 text-white placeholder-blue-300'
                      : 'bg-white border border-black/10 text-slate-900 placeholder-slate-400'
                  }`}
                  placeholder="Confirm new password"
                />
              </div>

              <div className={`rounded-lg p-4 flex items-start space-x-3 ${
                isDark ? 'bg-blue-500/10 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'
              }`}>
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>
                  Password must be at least 6 characters long and contain a mix of letters and numbers.
                </p>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all"
              >
                Update Password
              </button>
            </div>
          </motion.div>
        ) : activeSection === 'about' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`backdrop-blur-lg rounded-2xl p-6 border ${
              isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-black/10'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>About TravelConnect</h2>
              <button
                onClick={() => setActiveSection(null)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? 'text-blue-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className={`space-y-4 leading-relaxed ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>
              <p>
                TravelConnect is a social travel app where you can share your trips, discover places through other travelers, and keep your favorite destinations organized.
              </p>
              <p>
                Post photos, add locations, interact through likes and comments, and explore what’s trending in the community.
              </p>
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Version</div>
                <div className={isDark ? 'text-blue-200' : 'text-slate-600'}>v1.0.0</div>
              </div>
            </div>
          </motion.div>
        ) : activeSection === 'faq' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`backdrop-blur-lg rounded-2xl p-6 border ${
              isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-black/10'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>FAQ</h2>
              <button
                onClick={() => setActiveSection(null)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? 'text-blue-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>How do I create a post?</div>
                <div className={`mt-2 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>Go to Create, select an image, write a caption, choose a city, and publish.</div>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Why can’t I see comments?</div>
                <div className={`mt-2 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>Tap the comment icon on a post to load and view comments.</div>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>What makes a post trending?</div>
                <div className={`mt-2 ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>Trending posts are based on engagement (likes + comments) or popular locations with multiple posts.</div>
              </div>
            </div>
          </motion.div>
        ) : activeSection === 'contact' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`backdrop-blur-lg rounded-2xl p-6 border ${
              isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-black/10'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Contact Support</h2>
              <button
                onClick={() => setActiveSection(null)}
                className={`p-2 rounded-full transition-colors ${
                  isDark
                    ? 'text-blue-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className={`space-y-4 ${isDark ? 'text-blue-100' : 'text-slate-700'}`}>
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Email</div>
                <div className={`${isDark ? 'text-blue-200' : 'text-slate-600'} break-words`}>support@travelconnect.app</div>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Response time</div>
                <div className={isDark ? 'text-blue-200' : 'text-slate-600'}>Typically within 24–48 hours</div>
              </div>
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Include in your message</div>
                <div className={isDark ? 'text-blue-200' : 'text-slate-600'}>Your username, what happened, and screenshots if possible.</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`backdrop-blur-lg rounded-2xl border overflow-hidden ${
                  isDark ? 'bg-white/10 border-white/20' : 'bg-white/70 border-black/10'
                }`}
              >
                <div className={`p-4 border-b ${isDark ? 'border-white/20' : 'border-black/10'}`}>
                  <div className="flex items-center space-x-3">
                    <section.icon className={`w-5 h-5 ${isDark ? 'text-blue-300' : 'text-slate-600'}`} />
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{section.title}</h2>
                  </div>
                </div>

                <div className={`divide-y ${isDark ? 'divide-white/10' : 'divide-black/5'}`}>
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {item.icon && <item.icon className={`w-5 h-5 ${isDark ? 'text-blue-200' : 'text-slate-600'}`} />}
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</div>
                            {item.value && !item.toggle && (
                              <div className={`text-sm break-words ${isDark ? 'text-blue-200' : 'text-slate-600'}`}>{item.value}</div>
                            )}
                          </div>
                        </div>

                        {item.toggle ? (
                          <button
                            onClick={() => handleToggleSetting(section.id, item.id)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              item.value ? 'bg-blue-500' : (isDark ? 'bg-white/20' : 'bg-black/10')
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                item.value ? 'transform translate-x-6' : ''
                              }`}
                            />
                          </button>
                        ) : item.action ? (
                          <button
                            onClick={item.action}
                            className={`p-2 rounded-full transition-colors ${
                              isDark
                                ? 'text-blue-200 hover:text-white hover:bg-white/10'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                            }`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        ) : (
                          <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-blue-200' : 'text-slate-500'}`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={onSignOut}
                className={`w-full backdrop-blur-lg rounded-2xl p-4 border transition-all ${
                  isDark
                    ? 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30'
                    : 'bg-red-50 border-red-200 hover:bg-red-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Log Out</span>
                </div>
              </button>
            </motion.div>

            {/* Delete Account */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion feature coming soon');
                  }
                }}
                className={`w-full backdrop-blur-lg rounded-2xl p-4 border transition-all ${
                  isDark
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white border-black/10 hover:bg-black/5'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <UserX className={`w-5 h-5 ${isDark ? 'text-blue-200' : 'text-slate-600'}`} />
                  <span className={`${isDark ? 'text-blue-200' : 'text-slate-700'} font-medium`}>Delete Account</span>
                </div>
              </button>
            </motion.div>

            {/* App Version */}
            <div className="text-center py-4">
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-slate-600'}`}>TravelConnect v1.0.0</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>© 2024 All rights reserved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
