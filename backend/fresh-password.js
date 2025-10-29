// Generate fresh password hash and update database
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function generateFreshPassword() {
  let connection;
  
  try {
    console.log('🔧 Generating fresh password hash...');
    
    // Create fresh password hash
    const password = 'admin123';
    const saltRounds = 10;
    const freshHash = bcrypt.hashSync(password, saltRounds);
    
    console.log('Fresh password hash:', freshHash);
    
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'barangay_bis',
      port: process.env.DB_PORT || 3306
    });
    
    // Update admin user with fresh hash
    await connection.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [freshHash, 'admin']
    );
    
    console.log('✅ Password updated with fresh hash');
    
    // Test the password
    const [users] = await connection.execute(
      'SELECT password FROM users WHERE username = ?',
      ['admin']
    );
    
    if (users.length > 0) {
      const isMatch = bcrypt.compareSync(password, users[0].password);
      console.log('Password test result:', isMatch ? '✅ PASS' : '❌ FAIL');
      
      if (isMatch) {
        console.log('\n🎉 SUCCESS! You can now login with:');
        console.log('Username: admin');
        console.log('Password: admin123');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

generateFreshPassword();
