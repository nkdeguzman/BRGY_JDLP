# Backend Troubleshooting Guide

## Common Issues and Solutions

### 1. Package.json Format Issue
✅ **FIXED**: Updated package.json with proper formatting and added `"type": "module"`

### 2. Missing Environment Variables
Create a `.env` file in the backend directory with:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=barangay_bis
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
```

### 3. Database Connection Issues
- Make sure MySQL is running
- Check if the database `barangay_bis` exists
- Verify database credentials in .env file

### 4. Dependencies Issues
Run these commands in the backend directory:
```bash
npm install
npm run dev
```

### 5. Test Backend Startup
Run the test server:
```bash
node test-server.js
```

### 6. Common Error Messages and Solutions

**Error: "Cannot find module"**
- Run `npm install` to install dependencies

**Error: "Database connection failed"**
- Check MySQL is running
- Verify database credentials
- Ensure database exists

**Error: "Port already in use"**
- Change PORT in .env file
- Kill process using the port

### 7. Step-by-Step Fix
1. Navigate to backend directory: `cd barangay-main/backend`
2. Install dependencies: `npm install`
3. Create .env file with database config
4. Start server: `npm run dev`

### 8. Test Authentication
Once server is running, test the login endpoint:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```
