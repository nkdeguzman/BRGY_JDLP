import pool from './src/config/db.js'
import bcrypt from 'bcryptjs'

async function diagnoseLogin() {
  try {
    console.log('🔍 Diagnosing login issues...\n')
    
    // 1. Check database connection
    console.log('1. Testing database connection...')
    const [connectionTest] = await pool.execute('SELECT 1 as test')
    console.log('✅ Database connection successful')
    
    // 2. Check if users table exists
    console.log('\n2. Checking users table...')
    const [tables] = await pool.execute("SHOW TABLES LIKE 'users'")
    if (tables.length === 0) {
      console.log('❌ Users table does not exist!')
      console.log('Creating users table...')
      
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
      console.log('✅ Users table created')
    } else {
      console.log('✅ Users table exists')
    }
    
    // 3. Check users in table
    console.log('\n3. Checking users in database...')
    const [users] = await pool.execute('SELECT id, username, role FROM users')
    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`)
    })
    
    // 4. Test admin user specifically
    console.log('\n4. Testing admin user...')
    const [adminUsers] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      ['admin']
    )
    
    if (adminUsers.length === 0) {
      console.log('❌ Admin user not found! Creating admin user...')
      const hashedPassword = bcrypt.hashSync('admin123', 10)
      
      await pool.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      )
      console.log('✅ Admin user created')
    } else {
      console.log('✅ Admin user found')
      
      // Test password verification
      const admin = adminUsers[0]
      const testPassword = 'admin123'
      const isPasswordValid = await bcrypt.compare(testPassword, admin.password)
      
      console.log(`Password verification test: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`)
      
      if (!isPasswordValid) {
        console.log('🔧 Updating admin password...')
        const newHashedPassword = bcrypt.hashSync('admin123', 10)
        await pool.execute(
          'UPDATE users SET password = ? WHERE username = ?',
          [newHashedPassword, 'admin']
        )
        console.log('✅ Admin password updated')
      }
    }
    
    // 5. Final test - simulate login
    console.log('\n5. Simulating login process...')
    const [testUsers] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      ['admin']
    )
    
    if (testUsers.length > 0) {
      const user = testUsers[0]
      const passwordMatch = await bcrypt.compare('admin123', user.password)
      
      if (passwordMatch) {
        console.log('✅ Login simulation successful!')
        console.log('You should be able to login with:')
        console.log('  Username: admin')
        console.log('  Password: admin123')
      } else {
        console.log('❌ Password verification failed')
      }
    }
    
    console.log('\n🎉 Diagnosis complete!')
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error)
  } finally {
    process.exit()
  }
}

diagnoseLogin()
