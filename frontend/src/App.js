



import { useState, useEffect } from 'react';
import { api } from './api';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MapPage from './components/MapPage';
import CreatePostPage from './components/CreatePostPage';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';

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
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

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
          likes: parseInt(post.likes_count) || 0,
          comments: parseInt(post.comments_count) || 0,
          date: new Date(post.created_at).toLocaleDateString(),
          isLiked: post.is_liked === true || post.is_liked === 'true' || post.is_liked === 1 || post.is_liked === '1',
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

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (isAuthenticated) {
        try {
          console.log('Fetching notifications...');
          const data = await api.notifications.getAll();
          console.log('Notifications received:', data);
          const formattedNotifications = data.map(notif => ({
            id: notif.notification_id,
            type: notif.type,
            user: {
              name: notif.actor_username,
              username: `@${notif.actor_username}`,
              avatar: notif.actor_avatar || `https://placehold.co/40x40/4f46e5/ffffff?text=${notif.actor_username.charAt(0).toUpperCase()}`
            },
            post: notif.post_title ? {
              title: notif.post_title,
              image: notif.post_image
            } : null,
            time: new Date(notif.created_at).toLocaleString(),
            read: notif.is_read
          }));
          console.log('Formatted notifications:', formattedNotifications);
          setNotifications(formattedNotifications);
        } catch (err) {
          console.error('Error fetching notifications:', err);
        }
      }
    };

    fetchNotifications();
  }, [isAuthenticated, currentPage]);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const profile = await api.auth.getProfile();
          setUserProfile(profile);
          
          const posts = await api.auth.getUserPosts();
          setUserPosts(posts);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

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

  // Handle mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      // Update local state to mark all as read
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({
          ...notif,
          read: true
        }))
      );
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  // Handle update profile
  const handleUpdateProfile = async (profileData) => {
    try {
      const updatedProfile = await api.auth.updateProfile(profileData);
      setUserProfile(updatedProfile);
      
      // Refresh user posts
      const posts = await api.auth.getUserPosts();
      setUserPosts(posts);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Handle like post with optimistic UI
  const handleLikePost = async (postId) => {
    // Store the current state before optimistic update
    const currentPost = posts.find(p => p.id === postId);
    const wasLiked = currentPost?.isLiked || false;
    const currentLikes = currentPost?.likes || 0;

    try {
      // Optimistic UI update - instant feedback
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !wasLiked,
            likes: wasLiked ? currentLikes - 1 : currentLikes + 1
          };
        }
        return post;
      }));

      // Make API call
      const result = await api.posts.like(postId);
      const nextLikesCount = Number.parseInt(result?.likes_count, 10);
      if (!Number.isNaN(nextLikesCount)) {
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: nextLikesCount,
              isLiked: !!result.liked
            };
          }
          return post;
        }));
      }
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert optimistic update on error
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: wasLiked,
            likes: currentLikes
          };
        }
        return post;
      }));
      // Don't show alert, just log error
      console.error('Failed to like post:', err.message);
    }
  };

  // Handle toggle comments
  const handleToggleComments = async (postId) => {
    // Toggle expanded state
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    // Fetch comments if not already loaded and expanding
    if (!expandedComments[postId] && !postComments[postId]) {
      try {
        const comments = await api.posts.getComments(postId);
        const formattedComments = comments.map(comment => ({
          id: comment.comment_id,
          text: comment.comment_text,
          user: {
            name: comment.username,
            username: `@${comment.username}`,
            avatar: comment.profile_picture_url || `https://placehold.co/40x40/4f46e5/ffffff?text=${comment.username.charAt(0).toUpperCase()}`
          },
          time: new Date(comment.created_at).toLocaleString(),
          parentId: comment.parent_comment_id
        }));
        setPostComments(prev => ({
          ...prev,
          [postId]: formattedComments
        }));
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    }
  };

  // Handle add comment
  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    try {
      await api.posts.addComment(postId, commentText);
      
      // Refresh comments for this post
      const comments = await api.posts.getComments(postId);
      const formattedComments = comments.map(comment => ({
        id: comment.comment_id,
        text: comment.comment_text,
        user: {
          name: comment.username,
          username: `@${comment.username}`,
          avatar: comment.profile_picture_url || `https://placehold.co/40x40/4f46e5/ffffff?text=${comment.username.charAt(0).toUpperCase()}`
        },
        time: new Date(comment.created_at).toLocaleString(),
        parentId: comment.parent_comment_id
      }));
      setPostComments(prev => ({
        ...prev,
        [postId]: formattedComments
      }));

      // Update comment count in posts
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.message);
    }
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
          likes: parseInt(post.likes_count) || 0,
          comments: parseInt(post.comments_count) || 0,
          date: new Date(post.created_at).toLocaleDateString(),
          isLiked: post.is_liked === true || post.is_liked === 'true' || post.is_liked === 1 || post.is_liked === '1',
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
        posts={posts}
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
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    );
  }

  if (currentPage === 'profile') {
    return (
      <ProfilePage
        goBack={goBack}
        goToSettings={goToSettings}
        onSignOut={handleSignOut}
        user={userProfile}
        userPosts={userPosts}
        onUpdateProfile={handleUpdateProfile}
      />
    );
  }

  if (currentPage === 'settings') {
    return (
      <SettingsPage
        goBack={goBack}
        onSignOut={handleSignOut}
        user={userProfile}
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
      onLikePost={handleLikePost}
      onToggleComments={handleToggleComments}
      onAddComment={handleAddComment}
      expandedComments={expandedComments}
      postComments={postComments}
    />
  );
}
