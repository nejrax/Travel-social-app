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
  }
};
