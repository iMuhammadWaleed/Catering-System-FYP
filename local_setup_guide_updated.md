# CaterPro Local Setup Guide

This guide provides instructions to set up and run the CaterPro MERN stack application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 16.x or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm**: Node Package Manager, which comes bundled with Node.js.
*   **MongoDB**: A NoSQL database. You can download and install it from [mongodb.com](https://www.mongodb.com/try/download/community).

## 1. Clone the Repository

First, clone the CaterPro repository to your local machine:

```bash
git clone <repository_url>
cd CaterPro-MERN-Stack
```

*(Replace `<repository_url>` with the actual URL of your GitHub repository.)*

## 2. Backend Setup

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables. Make sure to replace placeholder values with your actual configurations.

```
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/caterpro_dev

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration (for notifications and verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@caterpro.com
FROM_NAME=CaterPro

# File Upload Configuration
MAX_FILE_UPLOAD=5000000
FILE_UPLOAD_PATH=./public/uploads

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

### Start the Backend Server

```bash
npm run dev
```

This will start the backend server, typically on `http://localhost:5000`.

## 3. Frontend Setup

Open a new terminal, navigate to the `frontend` directory, and install the dependencies:

```bash
cd ../frontend
npm install
```

### Start the Frontend Development Server

```bash
npm start
```

This will start the frontend development server, typically on `http://localhost:3000`. Your browser should automatically open to this address.

## 4. Verification

Once both servers are running, navigate to `http://localhost:3000` in your web browser. You should see the CaterPro frontend application. The application should display a message indicating the backend status (e.g., "Backend Status: healthy, DB: connected").

If you encounter any issues, please refer to the `README.md` in the respective `frontend` and `backend` directories for more detailed troubleshooting.

## Built with ❤️ by the CaterPro Team, Powered by Manus AI

