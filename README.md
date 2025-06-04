# Task Manager Backend

A NestJS-based backend for a task management application with JWT authentication, MongoDB Atlas, role-based authorization, and comprehensive Swagger documentation.

## Features

- **User Authentication**: JWT-based authentication with HTTP-only cookies
- **Role-based Authorization**: Admin and regular user roles with appropriate access controls
- **Task Management**: CRUD operations for tasks with filtering, searching, and pagination
- **Admin Dashboard**: User management and system-wide logs
- **Soft Delete**: Non-destructive delete operations for data integrity
- **API Documentation**: Interactive Swagger documentation
- **Activity Logging**: Tracks user actions across the system

## Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB installation)
- Git

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd task-management/BE
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and update with your own values:

   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: The port the server will run on (default: 3000)
   - `FRONTEND_URL`: URL of your frontend application (for CORS)
   - `LIVE_FRONTEND_URL`: Production URL of your frontend application

4. **Run the application in development mode**:

   ```bash
   npm run start:dev
   ```

5. **Access Swagger documentation**:
   Open your browser and navigate to `http://localhost:3000/api`

## Database Setup

The application will automatically connect to MongoDB using the URI provided in the `.env` file. It will create the necessary collections and indexes when it first runs.

For optimal performance, the following indexes are created:

- Combined indexes for task filtering and searching
- Text indexes for full-text search across task titles and descriptions

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and receive JWT in HTTP-only cookie
- **POST /api/auth/logout**: Logout and clear authentication cookie
- **GET /api/auth/verify**: Verify JWT token and get user info

### Tasks (Authenticated Users)

- **GET /api/tasks**: Get tasks for logged-in user with search, filtering, and pagination
  - Query parameters:
    - `search`: Search in title and description
    - `status`: Filter by status (pending, in-progress, completed)
    - `priority`: Filter by priority (low, medium, high)
    - `page`: Page number for pagination
    - `limit`: Items per page
- **POST /api/tasks**: Create a new task
- **PUT /api/tasks/:id**: Update a task
- **DELETE /api/tasks/:id**: Soft delete a task

### Admin Panel (Admin Users Only)

- **GET /api/admin/users**: Get all users
- **GET /api/admin/users/:id/tasks**: Get all tasks of a specific user
- **DELETE /api/admin/users/:id**: Delete a user and their tasks
- **PUT /api/admin/users/:id/role**: Update user role
- **GET /api/admin/logs**: Get system activity logs

## Deployment

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT`
   - `FRONTEND_URL`
   - `LIVE_FRONTEND_URL`
   - `NODE_ENV=production`
4. Set the build command: `npm install && npm run build`
5. Set the start command: `npm run start:prod`
6. Click "Create Web Service"

### MongoDB Atlas Configuration

1. Ensure your MongoDB Atlas cluster is accessible from your deployment
2. Either:
   - Add Render's IP addresses to the Atlas IP whitelist, OR
   - Allow all IP addresses in Atlas (less secure, but easier for demos)

## Development

### Running Tests

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

### API Documentation

The API is fully documented with Swagger. When the application is running, you can access the interactive Swagger UI at `/api`.
