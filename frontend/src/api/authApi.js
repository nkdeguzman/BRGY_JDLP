import axios from 'axios'

const base = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
})

// Login function
export const login = (username, password) => {
  return base.post('/auth/login', { username, password })
}

// Logout function (for future use)
export const logout = () => {
  return base.post('/auth/logout')
}

// Get current user (for future use)
export const getCurrentUser = () => {
  return base.get('/auth/me')
}
