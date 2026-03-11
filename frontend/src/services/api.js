import axios from 'axios'

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken')
        window.location.href = '/login'
      } else if (status === 403) {
        console.error('Access forbidden:', data?.message || 'You do not have permission')
      } else if (status === 404) {
        console.error('Resource not found:', data?.message || 'The requested resource was not found')
      } else if (status >= 500) {
        console.error('Server error:', data?.message || 'An unexpected server error occurred')
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: Unable to reach the server. Please check your connection.')
    } else {
      // Error setting up request
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

// API functions for transactions
export const getTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params })
  return response.data
}

export const addTransaction = async (data) => {
  const response = await api.post('/transactions', data)
  return response.data
}

export const updateTransaction = async (id, data) => {
  const response = await api.put(`/transactions/${id}`, data)
  return response.data
}

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`)
  return response.data
}

// API functions for insights
export const getInsights = async () => {
  const response = await api.get('/insights')
  return response.data
}

// API function for health score
export const getHealthScore = async () => {
  const response = await api.get('/health-score')
  return response.data
}

// API function for predictions
export const getPredictions = async () => {
  const response = await api.get('/predictions')
  return response.data
}

// API function for chat
export const sendChatMessage = async (message) => {
  const response = await api.post('/chat', { message })
  return response.data
}

// API functions for authentication
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }
  return response.data
}

export const register = async (email, password, name) => {
  const response = await api.post('/auth/register', { email, password, name })
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem('authToken')
  return Promise.resolve()
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// API function for weekly reports
export const getWeeklyReport = async (startDate, endDate) => {
  const response = await api.get('/reports/weekly', {
    params: { startDate, endDate },
  })
  return response.data
}

// Export the axios instance for custom requests
export default api
