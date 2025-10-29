-- Database Setup Script for Authentication
-- Run this script in your MySQL database to create the users table

USE barangay_bis;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
-- The password is already hashed using bcrypt
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- You can also add more users manually:
-- INSERT INTO users (username, password, role) VALUES 
-- ('staff1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff');

-- To create a new user with hashed password, you can use this Node.js script:
/*
const bcrypt = require('bcryptjs');
const password = 'your_password';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log('Hashed password:', hashedPassword);
*/
