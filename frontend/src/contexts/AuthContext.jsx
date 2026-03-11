import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          localStorage.removeItem('authToken')
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password)
      if (data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
      }
      return { success: true, data }
    } catch (error) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
  }

  const register = async (email, password, name) => {
    try {
      const data = await apiRegister(email, password, name)
      if (data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
      }
      return { success: true, data }
    } catch (error) {
      console.error('Registration failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      }
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
      setUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (error) {
      console.error('Logout failed:', error)
      return { success: false, error: 'Logout failed. Please try again.' }
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
