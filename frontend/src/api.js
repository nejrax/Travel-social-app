const API_BASE_URL = 'http://localhost:5002/api';

export const api = {
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    },

    signup: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || error.errors?.[0]?.msg || 'Signup failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    },

    getProfile: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      return response.json();
    },

    updateProfile: async (profileData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },

    getUserPosts: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile/posts`, {
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      
      return response.json();
    },

    logout: () => {
      localStorage.removeItem('token');
    },

    getToken: () => {
      return localStorage.getItem('token');
    }
  },

  posts: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/posts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      return await response.json();
    },

    getByCity: async (city) => {
      const response = await fetch(`${API_BASE_URL}/posts/${city}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts by city');
      }
      
      return await response.json();
    },

    create: async (postData) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to create a post');
      }
      
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('description', postData.description);
      formData.append('city', postData.city);
      formData.append('googleMapsLink', postData.googleMapsLink);
      formData.append('price', postData.price || 0);
      if (postData.image) {
        formData.append('image', postData.image);
      }

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create post');
      }
      
      return await response.json();
    },

    like: async (postId) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to like a post');
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to like post');
      }
      
      return await response.json();
    },

    getComments: async (postId) => {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      return await response.json();
    },

    addComment: async (postId, commentText, parentCommentId = null) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to comment');
      }
      
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          comment_text: commentText,
          parent_comment_id: parentCommentId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      return await response.json();
    }
  },

  locations: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/locations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      
      return await response.json();
    },

    getCities: async () => {
      const response = await fetch(`${API_BASE_URL}/locations/cities`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      
      return await response.json();
    }
  },

  notifications: {
    getAll: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to view notifications');
      }
      
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      return await response.json();
    },

    markAsRead: async (notificationId) => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in');
      }
      
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return await response.json();
    },

    markAllAsRead: async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in');
      }
      
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      return await response.json();
    }
  }
};
