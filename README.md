# License Management System

A full-stack application for managing software licenses with a NestJS backend and Next.js frontend.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### Database Setup

1. Install PostgreSQL if you haven't already
2. Make sure PostgreSQL service is running
3. The application will automatically create the database and tables on first start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file and update it with your database credentials:
   ```bash
   cp .env.example .env
   ```

4. Create the initial admin user:
   ```bash
   npm run seed
   ```
   This will create an admin user with:
   - Email: admin@example.com
   - Password: admin123

5. Start the backend server:
   ```bash
   npm run start:dev
   ```

The server will run on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will run on http://localhost:3001

## Features

- License Management Dashboard
  - View all licenses in a table format
  - Add new licenses
  - Edit existing licenses
  - Delete licenses
- License Verification API
  - Endpoint: POST /api/check-license
  - Parameters: url, token
  - Returns license validity status
- User Authentication
  - JWT-based authentication
  - Protected routes
  - Admin user management

## API Endpoints

### Authentication

- POST /api/auth/login - Login with email and password
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```

### License Management

- GET /api/licenses - Get all licenses (requires authentication)
- POST /api/licenses - Create a new license (requires authentication)
- PUT /api/licenses/:id - Update a license (requires authentication)
- DELETE /api/licenses/:id - Delete a license (requires authentication)

### License Verification

- POST /api/check-license - Verify a license (public endpoint)
  ```json
  {
    "url": "example.com",
    "token": "license-token"
  }
  ```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- CORS enabled
- Input validation
