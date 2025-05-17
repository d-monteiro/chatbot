# Chatbot Backend API

A RESTful authentication API backend built with Node.js, Express, and MongoDB providing user authentication and management features.

## Features

- User registration and authentication
- JWT-based authentication
- Protected routes with middleware
- MongoDB integration with Mongoose
- Error handling and validation

## Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB Atlas**: Cloud database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

## Installation and Setup

### Prerequisites

- Node.js (v12.x or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## API Endpoints

### Authentication

| Method | Endpoint       | Description               | Access      |
|--------|----------------|---------------------------|-------------|
| POST   | /api/register  | Register a new user       | Public      |
| POST   | /api/login     | Login user                | Public      |
| GET    | /api/me        | Get current user profile  | Private     |
| GET    | /api/logout    | Logout user               | Private     |

### Authentication Flow

1. **Registration**: User registers with name, email, and password
2. **Login**: User logs in with email and password
3. **Token**: Server generates JWT token and returns it to client
4. **Auth**: Client includes token in Authorization header for protected routes
5. **Verification**: Server verifies token to grant access to protected routes