



import { useState, useEffect } from 'react';
import { api } from './api';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MapPage from './components/MapPage';
import CreatePostPage from './components/CreatePostPage';
import NotificationsPage from './components/NotificationsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await api.posts.getAll();
        const formattedPosts = data.map(post => ({
          id: post.post_id,
          user: {
            name: post.username,
            username: `@${post.username}`,
            avatar: `https://placehold.co/40x40/4f46e5/ffffff?text=${post.username.charAt(0).toUpperCase()}`
          },
          image: post.image_url,
          caption: post.description,
          location: post.city,
          likes: 0,
          comments: 0,
          date: new Date(post.created_at).toLocaleDateString(),
          isLiked: false,
          title: post.title,
          price: post.price,
          googleMapsLink: post.google_maps_link
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentPage === 'home' || isAuthenticated) {
      fetchPosts();
    }
  }, [currentPage, isAuthenticated]);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await api.locations.getAll();
        setLocations(data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = api.auth.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle splash screen animation
  useEffect(() => {
    if (currentPage === 'splash') {
      const timer1 = setTimeout(() => setShowLogo(true), 300);
      const timer2 = setTimeout(() => setShowText(true), 1500);
      const timer3 = setTimeout(() => setCurrentPage('login'), 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [currentPage]);

  // Navigation functions
  const goToHome = () => setCurrentPage('home');
  const goToLogin = () => setCurrentPage('login');
  const goToProfile = () => setCurrentPage('profile');
  const goToCreate = () => setCurrentPage('create');
  const goToFind = () => setCurrentPage('find');
  const goToNotifications = () => setCurrentPage('notifications');
  const goToMap = () => setCurrentPage('map');
  const goToSettings = () => setCurrentPage('settings');
  const goBack = () => setCurrentPage('home');

  // Handle sign out
  const handleSignOut = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
    goToLogin();
  };

  // Handle create post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (selectedImage && caption.trim() && postLocation.trim()) {
      try {
        setLoading(true);
        const newPost = {
          title: caption.substring(0, 50),
          description: caption,
          city: postLocation.split(',')[0].trim(),
          googleMapsLink: 'https://maps.app.goo.gl/example',
          price: 0,
          image: selectedImage
        };
        await api.posts.create(newPost);
        alert('Post created successfully!');
        setSelectedImage(null);
        setCaption('');
        setPostLocation('');
        goToHome();
        
        // Refresh posts
        const data = await api.posts.getAll();
        const formattedPosts = data.map(post => ({
          id: post.post_id,
          user: {
            name: post.username,
            username: `@${post.username}`,
            avatar: `https://placehold.co/40x40/4f46e5/ffffff?text=${post.username.charAt(0).toUpperCase()}`
          },
          image: post.image_url,
          caption: post.description,
          location: post.city,
          likes: 0,
          comments: 0,
          date: new Date(post.created_at).toLocaleDateString(),
          isLiked: false,
          title: post.title,
          price: post.price,
          googleMapsLink: post.google_maps_link
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.error('Error creating post:', err.message);
        alert('Failed to create post: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle login/signup
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (isLogin) {
        await api.auth.login(loginEmail, loginPassword);
      } else {
        await api.auth.signup(loginEmail, loginPassword);
      }
      setIsAuthenticated(true);
      goToHome();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render pages
  if (currentPage === 'splash') {
    return <SplashScreen showLogo={showLogo} showText={showText} />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loading={loading}
        error={error}
        onSubmit={handleAuthSubmit}
        goToHome={goToHome}
      />
    );
  }

  if (currentPage === 'map') {
    return (
      <MapPage
        goBack={goBack}
        goToProfile={goToProfile}
        goToSettings={goToSettings}
        goToNotifications={goToNotifications}
        onSignOut={handleSignOut}
        unreadCount={unreadCount}
      />
    );
  }

  if (currentPage === 'create') {
    return (
      <CreatePostPage
        goBack={goBack}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        caption={caption}
        setCaption={setCaption}
        location={postLocation}
        setLocation={setPostLocation}
        onSubmit={handleCreatePost}
      />
    );
  }

  if (currentPage === 'notifications') {
    return (
      <NotificationsPage
        goBack={goBack}
        notifications={notifications}
        unreadCount={unreadCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
  }

  // Default to HomePage
  return (
    <HomePage
      posts={posts}
      loading={loading}
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      unreadCount={unreadCount}
      goToCreate={goToCreate}
      goToFind={goToFind}
      goToProfile={goToProfile}
      goToNotifications={goToNotifications}
      goToSettings={goToSettings}
      goToMap={goToMap}
      onSignOut={handleSignOut}
    />
  );
}
