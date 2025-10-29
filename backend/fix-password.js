// Fix password hash for existing user
import pool from './src/config/db.js'
import bcrypt from 'bcryptjs'

async function fixPassword() {
  try {
    console.log('🔧 Fixing password hash for admin1 user...\n')
    
    const username = 'admin1'
    const newPassword = 'admin123' // Change this to your desired password
    
    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    console.log('New password hash created')
    
    // Update the user's password
    await pool.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, username]
    )
    
    console.log('✅ Password updated successfully!')
    
    // Test the new password
    const [users] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    )
    
    if (users.length > 0) {
      const user = users[0]
      const isPasswordValid = await bcrypt.compare(newPassword, user.password)
      
      console.log(`\nPassword test result: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`)
      
      if (isPasswordValid) {
        console.log('\n🎉 Login should now work!')
        console.log(`Username: ${username}`)
        console.log(`Password: ${newPassword}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to fix password:', error)
  } finally {
    process.exit()
  }
}

fixPassword()
