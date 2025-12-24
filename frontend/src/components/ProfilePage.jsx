import { motion } from 'framer-motion';
import { useState } from 'react';
import { api } from '../api';
import { 
  ArrowLeft, Camera, Edit2, MapPin, Calendar, Link as LinkIcon,
  Settings, Grid, Heart, MessageCircle, X, Check
} from 'lucide-react';
import UserDropdown from './UserDropdown';

const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export default function ProfilePage({ 
  goBack, 
  goToSettings, 
  onSignOut,
  user,
  userPosts,
  onUpdateProfile
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      let profilePictureUrl = selectedImage;
      if (selectedImageFile) {
        const uploaded = await api.auth.uploadProfilePhoto(selectedImageFile);
        profilePictureUrl = uploaded.profilePicture;
      }

      await onUpdateProfile({
        ...editedProfile,
        profilePicture: profilePictureUrl
      });
      setIsEditing(false);
      setSelectedImage(null);
      setSelectedImageFile(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || ''
    });
    setSelectedImage(null);
    setSelectedImageFile(null);
  };

  const stats = {
    posts: userPosts?.length || 0,
    followers: user?.followers || 0,
    following: user?.following || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-[url('https://placehold.co/1920x1080/1e293b/ffffff?text=World+Map')] bg-cover bg-center"></div>
      </div>
      
      <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-orange-500 rounded-full opacity-20 blur-xl"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 pb-20">
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
            <h1 className="text-2xl font-bold text-white">
              {user?.username || 'Profile'}
            </h1>
          </div>

          <button
            onClick={goToSettings}
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                <img
                  src={selectedImage || user?.profilePicture || `https://placehold.co/128x128/4f46e5/ffffff?text=${user?.name?.charAt(0) || 'U'}`}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full cursor-pointer hover:from-blue-600 hover:to-orange-600 transition-all">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                    <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-center md:justify-start space-x-8 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{stats.posts}</div>
                      <div className="text-sm text-blue-200">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{stats.followers}</div>
                      <div className="text-sm text-blue-200">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{stats.following}</div>
                      <div className="text-sm text-blue-200">Following</div>
                    </div>
                  </div>

                  {user?.bio && (
                    <p className="text-white mb-3">{user.bio}</p>
                  )}

                  <div className="space-y-1">
                    {user?.location && (
                      <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-200">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    )}
                    {user?.website && (
                      <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-200">
                        <LinkIcon className="w-4 h-4" />
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                          {user.website}
                        </a>
                      </div>
                    )}
                    {user?.joinedDate && (
                      <div className="flex items-center justify-center md:justify-start space-x-2 text-blue-200">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Bio</label>
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Location</label>
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Website</label>
                    <input
                      type="url"
                      value={editedProfile.website}
                      onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-6"
        >
          <div className="flex border-b border-white/20">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 transition-colors ${
                activeTab === 'posts'
                  ? 'text-white border-b-2 border-blue-400'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Posts</span>
            </button>
          </div>

          {/* Posts Grid */}
          <div className="p-4">
            {activeTab === 'posts' && (
              <div className="grid grid-cols-3 gap-2">
                {userPosts && userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post.id} className="relative aspect-square group cursor-pointer">
                      <img
                        src={typeof post.image === 'string' && post.image.startsWith('/uploads/') ? `${API_ORIGIN}${post.image}` : post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-1 text-white">
                          <Heart className="w-5 h-5" fill="white" />
                          <span className="font-semibold">{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white">
                          <MessageCircle className="w-5 h-5" fill="white" />
                          <span className="font-semibold">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <Camera className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Posts Yet</h3>
                    <p className="text-blue-200">Share your travel adventures!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
