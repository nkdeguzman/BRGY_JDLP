# Login Troubleshooting Guide

## Quick Fix Steps

### 1. Run Database Diagnosis
```bash
cd barangay-main/backend
node diagnose-login.js
```

### 2. Run Login Test
```bash
cd barangay-main/backend
node test-login.js
```

### 3. Check Backend Logs
When you try to login, check the backend console for debug messages:
- Login attempt details
- Database query results
- Password comparison results

## Common Issues and Solutions

### Issue 1: Users Table Doesn't Exist
**Symptoms**: "Unknown column" or "Table doesn't exist" errors
**Solution**: Run the database setup script
```bash
node setup-database.js
```

### Issue 2: Admin User Not Created
**Symptoms**: "User not found" error
**Solution**: The test scripts will automatically create the admin user

### Issue 3: Password Hash Mismatch
**Symptoms**: "Invalid username or password" even with correct credentials
**Solution**: The test scripts will update the password hash

### Issue 4: Database Connection Issues
**Symptoms**: Connection errors or timeouts
**Solution**: 
1. Check if MySQL is running
2. Verify database credentials in .env file
3. Ensure database `barangay_bis` exists

## Manual Database Setup

If the scripts don't work, run this SQL manually:

```sql
USE barangay_bis;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE username=username;
```

## Test Credentials
- **Username**: `admin`
- **Password**: `admin123`

## Debug Information
The authentication controller now includes debug logging. Check your backend console when attempting to login to see:
- What username/password is being received
- Whether the user is found in the database
- Whether the password comparison succeeds

## Still Having Issues?
1. Check backend console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Try the manual SQL setup above
