# Learning Management System (LMS) Backend

This is the backend server for the Learning Management System (LMS) built with Express.js, MongoDB, and Clerk for authentication.

## Features

- Express.js server with modern ES modules
- MongoDB database integration
- Clerk authentication webhook integration
- Stripe payment integration
- RESTful API endpoints
- Environment variable configuration

## Project Structure

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

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (via MongoDB Atlas or local installation)
- Clerk account for authentication

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PORT=5000
```

## Available Scripts

- `npm run server` - Start the server with nodemon (development)
- `npm start` - Start the server in production mode

## API Endpoints

### GET /
- Returns a simple message indicating the API is working
- Response: `"API Working"`

### POST /clerk
- Handles Clerk webhook events
- Requires JSON body
- Used for authentication events

### POST /stripe
- Handles Stripe webhook events
- Requires raw JSON body
- Processes payment events and updates user status

### POST /purchase
- Initiates course purchase flow
- Creates Stripe checkout session
- Redirects to Stripe checkout page

## Database

The application uses MongoDB as the database. The connection is configured in `configs/mongodb.js` and uses environment variables for the connection string.

## Authentication

The application uses Clerk for authentication. The webhook integration allows the server to receive authentication events from Clerk, which can be used to manage user sessions and permissions.

## Error Handling

The server includes basic error handling middleware that will catch and log errors, returning appropriate error responses to the client.

## Development

The server is set up with nodemon for automatic restarts during development. Any changes to the source files will trigger a server restart.

## Security

- CORS middleware is configured for secure cross-origin requests
- Environment variables are used to store sensitive information
- Error messages are sanitized to prevent information leakage
