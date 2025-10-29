import pool from '../config/db.js'

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total residents count
    const [residentsResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM residents'
    )
    const totalResidents = residentsResult[0].total

    // Get total households count (assuming household_no is unique)
    const [householdsResult] = await pool.execute(
  'SELECT COUNT(*) as total FROM households'
)

    const totalHouseholds = householdsResult[0].total

    // Get pending incidents count (if incidents table exists)
    let pendingIncidents = 0
    try {
      const [incidentsResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM incidents WHERE status = "pending"'
      )
      pendingIncidents = incidentsResult[0].total
    } catch (error) {
      // If incidents table doesn't exist, set to 0
      console.log('Incidents table not found, setting to 0')
    }

    // Get pending documents count (if documents table exists)
    let pendingDocuments = 0
    try {
      const [documentsResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM documents WHERE status = "pending"'
      )
      pendingDocuments = documentsResult[0].total
    } catch (error) {
      // If documents table doesn't exist, set to 0
      console.log('Documents table not found, setting to 0')
    }

    // Get completed certificates count (if certificates table exists)
    let completedCertificates = 0
    try {
      const [certificatesResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM certificates WHERE status = "completed"'
      )
      completedCertificates = certificatesResult[0].total
    } catch (error) {
      // If certificates table doesn't exist, set to 0
      console.log('Certificates table not found, setting to 0')
    }

    // Calculate monthly growth (residents added this month)
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    
    const [monthlyGrowthResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM residents WHERE created_at >= ?',
      [startOfMonth]
    )
    const monthlyGrowth = monthlyGrowthResult[0].total

    // Calculate growth percentage
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    
    const [previousMonthResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM residents WHERE created_at >= ? AND created_at <= ?',
      [previousMonthStart, previousMonthEnd]
    )
    const previousMonthCount = previousMonthResult[0].total
    
    const growthPercentage = previousMonthCount > 0 
      ? ((monthlyGrowth - previousMonthCount) / previousMonthCount * 100).toFixed(1)
      : monthlyGrowth > 0 ? 100 : 0

    res.status(200).json({
      success: true,
      data: {
        totalResidents,
        totalHouseholds,
        pendingIncidents,
        pendingDocuments,
        completedCertificates,
        monthlyGrowth: monthlyGrowth,
        growthPercentage: parseFloat(growthPercentage)
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    })
  }
}

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    const activities = []

    // Get recent residents
    const [recentResidents] = await pool.execute(
      'SELECT id, first_name, last_name, created_at FROM residents ORDER BY created_at DESC LIMIT 3'
    )
    
    recentResidents.forEach(resident => {
      activities.push({
        id: `resident_${resident.id}`,
        type: 'resident',
        action: `New resident registered: ${resident.first_name} ${resident.last_name}`,
        time: resident.created_at,
        status: 'completed'
      })
    })

    // Get recent incidents (if table exists)
    try {
      const [recentIncidents] = await pool.execute(
        'SELECT id, description, status, created_at FROM incidents ORDER BY created_at DESC LIMIT 2'
      )
      
      recentIncidents.forEach(incident => {
        activities.push({
          id: `incident_${incident.id}`,
          type: 'incident',
          action: `Incident report: ${incident.description}`,
          time: incident.created_at,
          status: incident.status
        })
      })
    } catch (error) {
      console.log('Incidents table not found')
    }

    // Get recent documents (if table exists)
    try {
      const [recentDocuments] = await pool.execute(
        'SELECT id, type, status, created_at FROM documents ORDER BY created_at DESC LIMIT 2'
      )
      
      recentDocuments.forEach(document => {
        activities.push({
          id: `document_${document.id}`,
          type: 'document',
          action: `Document request: ${document.type}`,
          time: document.created_at,
          status: document.status
        })
      })
    } catch (error) {
      console.log('Documents table not found')
    }

    // Get recent certificates (if table exists)
    try {
      const [recentCertificates] = await pool.execute(
        'SELECT id, type, status, created_at FROM certificates ORDER BY created_at DESC LIMIT 2'
      )
      
      recentCertificates.forEach(certificate => {
        activities.push({
          id: `certificate_${certificate.id}`,
          type: 'certificate',
          action: `Certificate issued: ${certificate.type}`,
          time: certificate.created_at,
          status: certificate.status
        })
      })
    } catch (error) {
      console.log('Certificates table not found')
    }

    // Sort by time and limit to 5 most recent
    activities.sort((a, b) => new Date(b.time) - new Date(a.time))
    const recentActivities = activities.slice(0, 5)

    res.status(200).json({
      success: true,
      data: recentActivities
    })

  } catch (error) {
    console.error('Error fetching recent activities:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities'
    })
  }
}
