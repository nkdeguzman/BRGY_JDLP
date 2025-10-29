import axios from 'axios'

const base = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
})

// Get dashboard statistics
export const getDashboardStats = () => {
  return base.get('/stats/dashboard')
}

// Get recent activities
export const getRecentActivities = () => {
  return base.get('/stats/activities')
}
