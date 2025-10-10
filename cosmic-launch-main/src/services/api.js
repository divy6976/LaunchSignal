import axios from 'axios';

// Base API configuration
// In production on Vercel, set VITE_API_URL to your Render backend origin.
// Example: VITE_API_URL=https://your-backend.onrender.com
// If not set, auto-fallback to Render when running on the Vercel domain.
const inferredOrigin = (typeof window !== 'undefined' && (window.location.host.includes('launch-signal.vercel.app') || window.location.host.includes('launch-signal.tech')))
  ? 'https://launchsignal.onrender.com'
  : '';
const API_ORIGIN = (import.meta?.env?.VITE_API_URL || inferredOrigin || '').replace(/\/$/, '');
const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';
if (typeof window !== 'undefined') {
  // Log once to help verify the resolved API base in production builds
  // eslint-disable-next-line no-console
  console.log('[API] Using base URL:', API_BASE_URL);
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies via Vite proxy (same-origin dev)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Add any auth headers if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // For local dev, don't auto-redirect on 401; surface error to UI instead
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// ==================== USER APIs ====================

export const userAPI = {
  // Sign up a new user
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Google OAuth login (accepts either { credential } or { accessToken })
  googleLogin: async (payload) => {
    const response = await api.post('/users/google-login', payload);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/getProfile');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
};

// ==================== STARTUP APIs ====================

export const startupAPI = {
  // Create a new startup (Founder only)
  createStartup: async (startupData) => {
    const response = await api.post('/startups', startupData);
    return response.data;
  },

  // Get personalized feed for adopters
  getFeedForAdopter: async () => {
    const response = await api.get('/startups');
    return response.data;
  },

  // Get startups for founder
  getStartupsForFounder: async () => {
    const response = await api.get('/startups/my-startups');
    return response.data;
  },

  // Get feedback for a specific startup (Founder only)
  getFeedbackForStartup: async (startupId) => {
    const response = await api.get(`/startups/${startupId}/feedback`);
    return response.data;
  },

  // Get detailed analytics for a specific startup (Founder only)
  getStartupAnalytics: async (startupId) => {
    const response = await api.get(`/startups/${startupId}/analytics`);
    return response.data;
  },
  // Get startup details by id
  getStartupById: async (id) => {
    const response = await api.get(`/startups/${id}`);
    return response.data;
  },

  // Update an existing startup (Founder only)
  updateStartup: async (startupId, startupData) => {
    const response = await api.put(`/startups/${startupId}`, startupData);
    return response.data;
  },
  // Get startups for current founder (analytics base)
  getStartupsForFounder: async () => {
    const response = await api.get('/startups/my-startups');
    return response.data;
  },

  // Upvotes persistence for adopter
  upvote: async (id) => {
    const response = await api.post(`/startups/${id}/upvote`);
    return response.data;
  },
  removeUpvote: async (id) => {
    const response = await api.delete(`/startups/${id}/upvote`);
    return response.data;
  },
  getMyUpvotes: async () => {
    const response = await api.get('/startups/my-upvotes/list');
    return response.data;
  },

  // Founder analytics (views, feedbacks, matches, weekly trending)
  getFounderAnalytics: async () => {
    const response = await api.get('/startups/founder/analytics');
    return response.data;
  },

  // Public trending startups (by upvotes); window: 'week' | 'all'
  getTrending: async (window = 'week') => {
    const response = await api.get(`/startups/trending?window=${encodeURIComponent(window)}`);
    return response.data;
  },

  // Get filter options for dropdowns
  getFilterOptions: async () => {
    const response = await api.get('/startups/filter-options');
    return response.data;
  },

  // Increment view count for a startup
  incrementView: async (id) => {
    const response = await api.post(`/startups/${id}/view`);
    return response.data;
  },

  // Admin: set startup status
  setStatus: async (id, status) => {
    const response = await api.patch(`/startups/${id}/status`, { status });
    return response.data;
  },
  // Admin: list startups
  adminList: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/startups/admin/list${query ? `?${query}` : ''}`);
    return response.data;
  },

  // Admin: counts for dashboard
  adminCounts: async () => {
    const response = await api.get('/startups/admin/counts');
    return response.data;
  },

  // Test routes
  testStartupRoutes: async () => {
    const response = await api.get('/startups/test');
    return response.data;
  },
};

// ==================== FEEDBACK APIs ====================

export const feedbackAPI = {
  // Submit feedback for a startup (Adopter only)
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },
};

// ==================== UTILITY APIs ====================

export const utilityAPI = {
  // Test server connection
  testServer: async () => {
    const response = await api.get('/test');
    return response.data;
  },
};

// ==================== ERROR HANDLING ====================

export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Server is not responding. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: 'An unexpected error occurred',
      status: 0,
    };
  }
};

export default api;
