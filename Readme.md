# Learning Management System (LMS)

## Overview
This is a full-stack Learning Management System (LMS) designed to facilitate online education. The platform allows students to browse and enroll in courses, manage their enrollments, and interact with educational content, while educators can create and manage courses. The project is currently in development, with the frontend already built and the backend planned for future implementation.

## Project Status
- **Frontend**: Completed (built with React, Tailwind CSS, and Vite)
- **Backend**: In Progress
  - Express.js server setup with modern ES modules
  - MongoDB integration with proper connection handling
  - Clerk authentication webhook integration
  - Basic API endpoints implemented
  - Environment variable configuration
  - Error handling middleware
- **Deployment**: Not yet deployed

## Current Backend Progress

### Backend Infrastructure
- Set up Express.js server with modern ES modules
- Implemented MongoDB database connection with proper error handling
- Configured environment variables for database and authentication
- Added CORS middleware for secure cross-origin requests

### Authentication
- Integrated Clerk authentication system
- Set up webhook handling for authentication events
- Configured Clerk webhook secret in environment variables

### API Endpoints
- Implemented basic health check endpoint (`GET /`)
- Set up Clerk webhook endpoint (`POST /clerk`)
- Added proper request body parsing middleware

### Project Structure
```
server/
├── configs/
│   └── mongodb.js         # MongoDB connection configuration
├── controllers/
│   └── webhooks.js        # Clerk webhook handlers
├── models/
│   └── user.js           # User model definition
├── server.js              # Main server file
└── .env                  # Environment variables
```

## Features (Planned)

For detailed backend documentation, see: [Backend Documentation](./server/README.md)

## Features (Planned)
- **Student Features**:
  - Browse and enroll in courses
  - View course details and sections
  - Manage enrollments and track progress
- **Educator Features**:
  - Create and manage courses
  - View enrolled students
  - Upload course materials
- **General Features**:
  - User authentication (students and educators)
  - Responsive design
  - Search and filter courses

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite, React Router
- **Backend** (planned): Node.js, Express, MongoDB
- **Deployment** (planned): Docker, AWS/Google Cloud

## Prerequisites
To work on this project, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or Yarn
- Git
- (For backend, planned): MongoDB

## Installation
The project is split into two main parts: the frontend (client) and the backend (server). Currently, only the frontend is available.

### Frontend Setup
The frontend is already developed. For detailed setup instructions, refer to the [Client Documentation](./client/README.md).

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Follow the instructions in the [Client README](./client/README.md) to set up and run the frontend.

### Backend Setup
The backend is not yet implemented. Once developed, it will include:
- A REST API built with Node.js and Express
- MongoDB for data storage
- Authentication with JWT
- Endpoints for course management, user authentication, and enrollments

To set up the backend (once developed):
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (e.g., MongoDB URI, JWT secret).
4. Run the server:
   ```bash
   npm run dev
   ```

## Project Structure
- **`/client`**: Frontend code (React, Tailwind CSS, Vite)
  - See the [Client README](./client) for details.
- **`/server`** (planned): Backend code (Node.js, Express, MongoDB)
- **`/docs`**: Documentation files

## Usage
Once the full application is complete:
1. Start the backend server (`cd server && npm run dev`).
2. Start the frontend development server (`cd client && npm run dev`).
3. Access the app at `http://localhost:5173` (or the specified port).
4. Register as a student or educator to access the respective dashboards.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License
This project is licensed under the MIT License.