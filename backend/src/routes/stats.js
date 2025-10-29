import express from 'express'
import { getDashboardStats, getRecentActivities } from '../controllers/statsController.js'

const router = express.Router()

// Get dashboard statistics
router.get('/dashboard', getDashboardStats)

// Get recent activities
router.get('/activities', getRecentActivities)

export default router
