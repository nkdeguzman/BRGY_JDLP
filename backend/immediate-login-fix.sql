# IMMEDIATE LOGIN FIX - Run this SQL

USE barangay_bis;

-- Update admin user with plain text password
UPDATE users SET password = 'admin123' WHERE username = 'admin';

-- If admin user doesn't exist, create it
INSERT IGNORE INTO users (username, password, role) VALUES 
('admin', 'admin123', 'admin');

-- Verify the user
SELECT id, username, password, role FROM users WHERE username = 'admin';
