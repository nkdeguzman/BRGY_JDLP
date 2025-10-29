-- Fix password for admin1 user
-- Run this SQL directly in your MySQL database

USE barangay_bis;

-- Update the password for admin1 user
-- This creates a proper bcrypt hash for 'admin123'
UPDATE users 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE username = 'admin1';

-- Verify the update
SELECT id, username, role FROM users WHERE username = 'admin1';

-- If the above doesn't work, try creating a fresh admin user:
-- DELETE FROM users WHERE username = 'admin1';
-- INSERT INTO users (username, password, role) VALUES 
-- ('admin1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
