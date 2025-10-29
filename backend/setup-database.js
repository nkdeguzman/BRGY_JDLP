import pool from './src/config/db.js'
import bcrypt from 'bcryptjs'

async function setupDatabase() {
  try {
    console.log('Setting up users table...')
    
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ Users table created successfully')
    
    // Check if admin user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    )
    
    if (existingUsers.length === 0) {
      // Create admin user with hashed password
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      
      await pool.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      )
      
      console.log('✅ Admin user created successfully')
      console.log('Username: admin')
      console.log('Password: admin123')
    } else {
      console.log('✅ Admin user already exists')
    }
    
    console.log('Database setup completed!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
  } finally {
    process.exit()
  }
}

setupDatabase()
