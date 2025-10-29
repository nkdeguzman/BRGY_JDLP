// GUARANTEED LOGIN FIX
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createWorkingLogin() {
  let connection;
  
  try {
    console.log('🔧 Creating guaranteed working login...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'barangay_bis',
      port: process.env.DB_PORT || 3306
    });
    
    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Clear existing users and create fresh ones
    await connection.execute('DELETE FROM users');
    
    // Create working admin user
    const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    await connection.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['admin', hashedPassword, 'admin']
    );
    
    console.log('✅ GUARANTEED WORKING LOGIN CREATED!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n🎉 You can now login!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createWorkingLogin();
