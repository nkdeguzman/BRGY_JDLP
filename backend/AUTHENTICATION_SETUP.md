# Authentication Setup Instructions

## Backend Dependencies
The following packages have been installed:
- `bcryptjs` - For password hashing
- `jsonwebtoken` - For JWT token generation

## Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=barangay_bis
DB_PORT=3306

# JWT Secret Key (change this to a secure random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=4000
```

## Database Setup
Make sure your `users` table has the following structure:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout (requires authentication)
- `GET /api/auth/me` - Get current user info (requires authentication)

## Usage
1. Start the backend server: `npm run dev`
2. The login page will now connect to your database
3. Users can login with their email and password from the database
4. JWT tokens are stored in localStorage for session management

## Security Notes
- Passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- Change the JWT_SECRET in production
- Use HTTPS in production
