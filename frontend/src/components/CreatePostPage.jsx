import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, MapPin } from 'lucide-react';

export default function CreatePostPage({ 
  goBack, 
  selectedImage, 
  setSelectedImage, 
  caption, 
  setCaption, 
  location, 
  setLocation,
  onSubmit 
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

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
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
          <form onSubmit={onSubmit} className="space-y-6">
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
                    src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
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
                        setSelectedImage(file);
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
                  required
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
