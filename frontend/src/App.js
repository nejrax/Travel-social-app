import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { api } from './api';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import MapPage from './components/MapPage';
import CreatePostPage from './components/CreatePostPage';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import FindPage from './components/FindPage';

export default function App() {
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
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatPosts = (data) => {
    const base = data.map(post => ({
      id: post.post_id,
      userId: post.user_id,
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
      isFollowing: post.is_following === true || post.is_following === 'true' || post.is_following === 1 || post.is_following === '1',
      title: post.title,
      price: post.price,
      googleMapsLink: post.google_maps_link
    }));

    const locationCounts = base.reduce((acc, p) => {
      const key = (p.location || '').toLowerCase();
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const ranked = [...base]
      .map(p => ({
        id: p.id,
        score: (p.likes || 0) + (p.comments || 0)
      }))
      .sort((a, b) => b.score - a.score);

    const topCount = Math.min(5, ranked.length);
    const topIds = new Set(ranked.slice(0, topCount).map(r => r.id));

    return base.map(p => {
      const locKey = (p.location || '').toLowerCase();
      const isPopularLocation = locKey && (locationCounts[locKey] || 0) >= 2;
      const isTopEngagement = topIds.has(p.id);
      return {
        ...p,
        isTrending: isTopEngagement || isPopularLocation
      };
    });
  };

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await api.posts.getAll();
        setPosts(formatPosts(data));
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handleToggleFollow = async (targetUserId) => {
    try {
      const result = await api.follows.toggle(targetUserId);

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.userId === targetUserId) {
          return {
            ...post,
            isFollowing: !!result.following
          };
        }
        return post;
      }));

      if (typeof result?.current_user_following_count === 'number') {
        setUserProfile(prev => prev ? { ...prev, following: result.current_user_following_count } : prev);
      }
    } catch (err) {
      console.error('Error following user:', err);
      alert(err.message);
    }
  };

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
  }, [isAuthenticated, location.pathname]);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const profile = await api.auth.getProfile();
          setUserProfile(profile);
          setCurrentUserId(profile?.id || null);
          
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
    const validateToken = async () => {
      const token = api.auth.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        return;
      }

      try {
        await api.auth.getProfile();
        setIsAuthenticated(true);
      } catch (err) {
        api.auth.logout();
        setIsAuthenticated(false);
        setCurrentUserId(null);
        setUserProfile(null);
        setUserPosts([]);
        setExpandedComments({});
        setPostComments({});
      } finally {
        setAuthChecked(true);
      }
    };

    validateToken();
  }, []);

  const goToHome = () => navigate('/home');
  const goToLogin = () => navigate('/login');
  const goToProfile = () => navigate('/profile');
  const goToCreate = () => navigate('/create');
  const goToFind = () => navigate('/find');
  const goToNotifications = () => navigate('/notifications');
  const goToMap = () => navigate('/map');
  const goToSettings = () => navigate('/settings');
  const goBack = () => navigate(-1);

  // Handle sign out
  const handleSignOut = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setUserProfile(null);
    setUserPosts([]);
    setExpandedComments({});
    setPostComments({});
    setLoginEmail('');
    setLoginPassword('');
    navigate('/login', { replace: true });
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

      setUserPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const nextLikes = wasLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1;
          return { ...post, likes: nextLikes };
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

        setUserPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return { ...post, likes: nextLikesCount };
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

      setUserPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return { ...post, likes: currentLikes };
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

      setUserPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: (post.comments || 0) + 1
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.posts.delete(postId);

      setPosts(prev => prev.filter(p => p.id !== postId));
      setUserPosts(prev => prev.filter(p => p.id !== postId));

      setExpandedComments(prev => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
      setPostComments(prev => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    } catch (err) {
      console.error('Error deleting post:', err);
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
        setPosts(formatPosts(data));
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
      setUserProfile(null);
      setUserPosts([]);
      setCurrentUserId(null);
      if (isLogin) {
        await api.auth.login(loginEmail, loginPassword);
      } else {
        await api.auth.signup(loginEmail, loginPassword);
      }
      setIsAuthenticated(true);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!authChecked) {
      return null;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const SplashRoute = () => {
    useEffect(() => {
      if (!authChecked) return;
      const timer1 = setTimeout(() => setShowLogo(true), 700);
      const timer2 = setTimeout(() => setShowText(true), 2500);
      const timer3 = setTimeout(() => {
        navigate(isAuthenticated ? '/home' : '/login', { replace: true });
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);

    return <SplashScreen showLogo={showLogo} showText={showText} />;
  };

  return (
    <Routes>
      <Route path="/" element={<SplashRoute />} />

      <Route
        path="/login"
        element={
          !authChecked ? null : isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
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
          )
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
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
              currentUserId={currentUserId}
              onToggleFollow={handleToggleFollow}
              expandedComments={expandedComments}
              postComments={postComments}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/find"
        element={
          <ProtectedRoute>
            <FindPage
              goBack={() => navigate('/home')}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePostPage
              goBack={() => navigate('/home')}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              caption={caption}
              setCaption={setCaption}
              location={postLocation}
              setLocation={setPostLocation}
              onSubmit={handleCreatePost}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage
              goBack={() => navigate('/home')}
              goToSettings={goToSettings}
              onSignOut={handleSignOut}
              user={userProfile}
              userPosts={userPosts}
              onUpdateProfile={handleUpdateProfile}
              posts={posts}
              currentUserId={currentUserId}
              expandedComments={expandedComments}
              postComments={postComments}
              onLikePost={handleLikePost}
              onToggleComments={handleToggleComments}
              onAddComment={handleAddComment}
              onDeletePost={handleDeletePost}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage
              goBack={() => navigate('/home')}
              notifications={notifications}
              unreadCount={unreadCount}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapPage
              goBack={() => navigate('/home')}
              goToProfile={goToProfile}
              goToSettings={goToSettings}
              goToNotifications={goToNotifications}
              onSignOut={handleSignOut}
              unreadCount={unreadCount}
              posts={posts}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage
              goBack={() => navigate('/home')}
              onSignOut={handleSignOut}
              user={userProfile}
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
