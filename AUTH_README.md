# Starlette Authentication System

## Overview

Starlette's authentication system is built with Next.js API routes and MongoDB. It provides a secure, scalable, and feature-rich authentication solution with JWT-based authentication.

## Features

- User registration and login
- JWT-based authentication
- Password reset functionality
- Profile management
- MongoDB integration
- Security best practices (password hashing, etc.)

## Setup Instructions

### 1. Install MongoDB

Make sure MongoDB is installed and running on your system. You can download it from [mongodb.com](https://www.mongodb.com/try/download/community).

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/starlette
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

Replace the values with your actual MongoDB connection string and a secure JWT secret.

### 3. Seed the Database (Optional)

To seed the database with test users:

```bash
npm run seed
```

This will create two test accounts:
- Admin: admin@starlette.com / admin123
- User: test@starlette.com / test123

## API Routes

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/validate` - Validate a JWT token
- `POST /api/auth/forgot-password` - Request a password reset
- `POST /api/auth/reset-password` - Reset a password with a token

### User Profile

- `GET /api/auth/profile` - Get the current user's profile
- `PUT /api/auth/profile` - Update the current user's profile

## Models

### User Model

The User model includes fields for:
- Name
- Email (unique)
- Password (hashed)
- Phone number
- Role (user/admin)
- Creation/update timestamps

### Token Model

Used for password reset and email verification tokens.
- User ID reference
- Token
- Token type (password-reset, email-verification)
- Expiration time (1 hour by default)

## Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns JWT token
3. Client stores token in localStorage
4. Token is sent with every authenticated request
5. Server validates token and grants access to protected resources

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Token expiration
- HTTP-only cookies option for enhanced security

## Development Notes

- The auth middleware in `/src/middleware/auth.js` can be used to protect any API route
- Token utilities in `/src/lib/tokens.js` provide functions for token generation and validation
- Database connection is managed in `/src/lib/mongodb.js` with connection pooling