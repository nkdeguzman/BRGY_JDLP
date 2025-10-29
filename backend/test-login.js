// Test login process step by step
import pool from './src/config/db.js'
import bcrypt from 'bcryptjs'

async function testLogin() {
  try {
    console.log('🧪 Testing login process...\n')
    
    const testUsername = 'admin'
    const testPassword = 'admin123'
    
    console.log(`Testing login with:`)
    console.log(`Username: ${testUsername}`)
    console.log(`Password: ${testPassword}\n`)
    
    // Step 1: Check if user exists
    console.log('Step 1: Checking if user exists...')
    const [users] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [testUsername]
    )
    
    if (users.length === 0) {
      console.log('❌ User not found!')
      console.log('Creating admin user...')
      
      const hashedPassword = bcrypt.hashSync(testPassword, 10)
      await pool.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [testUsername, hashedPassword, 'admin']
      )
      console.log('✅ Admin user created')
      
      // Try again
      const [newUsers] = await pool.execute(
        'SELECT id, username, password FROM users WHERE username = ?',
        [testUsername]
      )
      if (newUsers.length > 0) {
        console.log('✅ User found after creation')
        users.push(newUsers[0])
      }
    } else {
      console.log('✅ User found')
      console.log(`User ID: ${users[0].id}`)
      console.log(`Username: ${users[0].username}`)
      console.log(`Password hash: ${users[0].password.substring(0, 20)}...`)
    }
    
    if (users.length > 0) {
      const user = users[0]
      
      // Step 2: Test password comparison
      console.log('\nStep 2: Testing password comparison...')
      const isPasswordValid = await bcrypt.compare(testPassword, user.password)
      
      if (isPasswordValid) {
        console.log('✅ Password is valid!')
        console.log('Login should work correctly.')
      } else {
        console.log('❌ Password is invalid!')
        console.log('Updating password...')
        
        const newHashedPassword = bcrypt.hashSync(testPassword, 10)
        await pool.execute(
          'UPDATE users SET password = ? WHERE username = ?',
          [newHashedPassword, testUsername]
        )
        console.log('✅ Password updated')
        
        // Test again
        const isPasswordValidAfterUpdate = await bcrypt.compare(testPassword, newHashedPassword)
        console.log(`Password test after update: ${isPasswordValidAfterUpdate ? '✅ PASS' : '❌ FAIL'}`)
      }
    }
    
    console.log('\n🎉 Test complete!')
    console.log('\nTry logging in with:')
    console.log('Username: admin')
    console.log('Password: admin123')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    process.exit()
  }
}

testLogin()
