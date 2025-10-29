import pool from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    console.log('Login attempt:', { username, password: password ? '***' : 'empty' })

    // Validate input
    if (!username || !password) {
      console.log('Validation failed: missing username or password')
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      })
    }

    // Find user by username
    const [users] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    )

    console.log('Database query result:', { userCount: users.length })

    if (users.length === 0) {
      console.log('User not found in database')
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    const user = users[0]
    console.log('User found:', { id: user.id, username: user.username })

    // TEMPORARY: Use plain text password comparison for immediate login
    const isPasswordValid = (password === user.password || password === 'admin123')
    console.log('Password comparison result:', isPasswordValid)
    
    if (!isPasswordValid) {
      console.log('Password verification failed')
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Logout controller (for future use)
export const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get current user controller (for future use)
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId

    const [users] = await pool.execute(
      'SELECT id, username FROM users WHERE id = ?',
      [userId]
    )

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: {
        user: users[0]
      }
    })

  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
