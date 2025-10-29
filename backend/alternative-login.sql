# ALTERNATIVE SQL SOLUTION - Try this if the first one didn't work

USE barangay_bis;

-- Delete existing admin user
DELETE FROM users WHERE username = 'admin';

-- Insert with a different password hash approach
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvO8gX7Q8K8Y8Y8Y8Y8Y8Y8Y8Y8Y', 'admin');

-- If that doesn't work, try this simpler approach:
-- DELETE FROM users WHERE username = 'admin';
-- INSERT INTO users (username, password, role) VALUES 
-- ('admin', 'admin123', 'admin');

-- Then you would need to modify the auth controller to use plain text comparison
-- (This is just for testing - not recommended for production)
