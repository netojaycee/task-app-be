# Task Manager Backend

A NestJS-based backend for a task manager application with JWT authentication, MongoDB Atlas, and Swagger documentation.

## Setup
1. Clone the repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update with your MongoDB Atlas URL and JWT secret.
4. Run the application: `npm run start:dev`
5. Access Swagger docs at `http://localhost:3000/api`

## Endpoints
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login and receive JWT in HTTP-only cookie
- **GET /api/tasks**: Get all tasks for the logged-in user
- **POST /api/tasks**: Create a new task
- **PUT /api/tasks/:id**: Update a task
- **DELETE /api/tasks/:id**: Soft delete a task
- **GET /api/admin/users**: Get all users (admin only)
- **GET /api/admin/users/:id/tasks**: Get all tasks of a user (admin only)
- **DELETE /api/admin/users/:id**: Soft delete a user and their tasks (admin only)
- **PUT /api/admin/users/:id/role**: Update user role (admin only)
- **GET /api/admin/logs**: Get all logs (admin only)

## Deployment
1. Deploy to Render:
   - Create a new Web Service on Render.
   - Set the repository and configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`).
   - Use `npm run start:prod` as the start command.
2. Ensure MongoDB Atlas is accessible (whitelist Render's IP or allow all IPs).
3. Live demo: [Link to Loom video]

## Swagger
API documentation is available at `/api` when the server is running.