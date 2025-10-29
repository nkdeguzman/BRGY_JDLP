// Check and fix password for admin1 user
import pool from './src/config/db.js'
import bcrypt from 'bcryptjs'

async function checkAndFixPassword() {
  try {
    console.log('🔍 Checking admin1 user password...\n')
    
    const username = 'admin1'
    
    // Get current user data
    const [users] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    )
    
    if (users.length === 0) {
      console.log('❌ User admin1 not found!')
      return
    }
    
    const user = users[0]
    console.log(`Found user: ${user.username} (ID: ${user.id})`)
    console.log(`Current password hash: ${user.password.substring(0, 30)}...`)
    
    // Test common passwords
    const commonPasswords = [
      'admin123',
      'admin',
      'password',
      '123456',
      'admin1',
      'password123'
    ]
    
    console.log('\n🧪 Testing common passwords...')
    let foundPassword = null
    
    for (const testPassword of commonPasswords) {
      const isValid = await bcrypt.compare(testPassword, user.password)
      if (isValid) {
        foundPassword = testPassword
        console.log(`✅ Found matching password: "${testPassword}"`)
        break
      } else {
        console.log(`❌ "${testPassword}" - no match`)
      }
    }
    
    if (!foundPassword) {
      console.log('\n🔧 No matching password found. Setting new password...')
      const newPassword = 'admin123'
      const newHashedPassword = bcrypt.hashSync(newPassword, 10)
      
      await pool.execute(
        'UPDATE users SET password = ? WHERE username = ?',
        [newHashedPassword, username]
      )
      
      console.log('✅ Password updated to: admin123')
      console.log('\n🎉 You can now login with:')
      console.log('Username: admin1')
      console.log('Password: admin123')
    } else {
      console.log(`\n🎉 You can login with:`)
      console.log(`Username: admin1`)
      console.log(`Password: ${foundPassword}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    process.exit()
  }
}

checkAndFixPassword()
