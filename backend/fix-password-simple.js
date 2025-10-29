// Simple password fix script
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPassword() {
  let connection;
  
  try {
    console.log('🔧 Fixing admin1 password...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'barangay_bis',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ Connected to database');
    
    // Update password for admin1
    const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    await connection.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin1']
    );
    
    console.log('✅ Password updated for admin1');
    
    // Verify the user exists
    const [rows] = await connection.execute(
      'SELECT id, username, role FROM users WHERE username = ?',
      ['admin1']
    );
    
    if (rows.length > 0) {
      console.log('✅ User found:', rows[0]);
      console.log('\n🎉 You can now login with:');
      console.log('Username: admin1');
      console.log('Password: admin123');
    } else {
      console.log('❌ User not found, creating new user...');
      
      await connection.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [hashedPassword, 'admin1', 'admin']
      );
      
      console.log('✅ New admin1 user created');
      console.log('\n🎉 You can now login with:');
      console.log('Username: admin1');
      console.log('Password: admin123');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixPassword();
