# URGENT: Login Still Not Working - Multiple Solutions

## Solution 1: Run Simple Fix Script
```bash
cd barangay-main/backend
node fix-password-simple.js
```

## Solution 2: Manual SQL Fix
Run this SQL in your MySQL database:
```sql
USE barangay_bis;
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE username = 'admin1';
```

## Solution 3: Create Fresh User
If admin1 still doesn't work, create a new user:
```sql
USE barangay_bis;
DELETE FROM users WHERE username = 'admin1';
INSERT INTO users (username, password, role) VALUES 
('admin1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

## Solution 4: Use Different Username
Create a completely new user:
```sql
USE barangay_bis;
INSERT INTO users (username, password, role) VALUES 
('test', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

## Solution 5: Check Database Connection
Make sure your .env file has correct database settings:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=barangay_bis
DB_PORT=3306
```

## Test Credentials (After Fix)
- **Username**: admin1 (or test)
- **Password**: admin123

## Debug Steps
1. Check if backend is running: `npm run dev`
2. Check database connection
3. Verify users table exists
4. Try different username/password combinations

## Emergency Solution
If nothing works, delete and recreate the users table:
```sql
USE barangay_bis;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
```

Then try logging in with:
- Username: admin
- Password: admin123
