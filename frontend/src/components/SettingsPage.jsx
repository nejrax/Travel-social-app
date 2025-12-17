import { motion } from 'framer-motion';
import { useState } from 'react';
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
        { id: 'theme', label: 'Theme', value: settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode', icon: settings.theme === 'dark' ? Moon : Sun }
      ]
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      items: [
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'contact', label: 'Contact Support', icon: Mail },
        { id: 'about', label: 'About TravelConnect', icon: Globe }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
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
              className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </motion.header>

        {activeSection === 'password' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <button
                onClick={() => setActiveSection(null)}
                className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-200">
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
        ) : (
          <div className="space-y-4">
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
              >
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    <section.icon className="w-5 h-5 text-blue-300" />
                    <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          {item.icon && <item.icon className="w-5 h-5 text-blue-200" />}
                          <div className="flex-1">
                            <div className="text-white font-medium">{item.label}</div>
                            {item.value && !item.toggle && (
                              <div className="text-sm text-blue-200">{item.value}</div>
                            )}
                          </div>
                        </div>

                        {item.toggle ? (
                          <button
                            onClick={() => handleToggleSetting(section.id, item.id)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              item.value ? 'bg-blue-500' : 'bg-white/20'
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
                            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        ) : (
                          <ChevronRight className="w-5 h-5 text-blue-200" />
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
                className="w-full bg-red-500/20 backdrop-blur-lg rounded-2xl p-4 border border-red-400/30 hover:bg-red-500/30 transition-all"
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
                className="w-full bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-center space-x-3">
                  <UserX className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-200 font-medium">Delete Account</span>
                </div>
              </button>
            </motion.div>

            {/* App Version */}
            <div className="text-center py-4">
              <p className="text-sm text-blue-300">TravelConnect v1.0.0</p>
              <p className="text-xs text-blue-200 mt-1">© 2024 All rights reserved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
