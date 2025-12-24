import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, MapPin, Check, UserPlus, AtSign, Camera } from 'lucide-react';
import { useEffect } from 'react';
import { useTheme } from '../theme';

export default function NotificationsPage({ 
  goBack, 
  notifications, 
  unreadCount,
  activeTab,
  setActiveTab,
  onMarkAllAsRead
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Mark all notifications as read when page opens
  useEffect(() => {
    if (unreadCount > 0 && onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  }, []);
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

  const getNotificationText = (type) => {
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
      <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white rounded-full opacity-10"></div>

      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
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
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
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
                  : (isDark
                      ? 'bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white'
                      : 'bg-black/5 text-slate-700 hover:bg-black/10 hover:text-slate-900')
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
                className={`backdrop-blur-lg rounded-2xl p-4 border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 border-white/20 hover:bg-white/20'
                    : 'bg-white/70 border-black/10 hover:bg-black/5'
                } ${
                  !notification.read ? 'border-l-4 border-l-blue-400' : ''
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
                      {getNotificationText(notification.type)}
                    </p>
                    
                    {notification.type === 'comment' && notification.comment && (
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
                  ? "You're all caught up! Check back later for new updates."
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
