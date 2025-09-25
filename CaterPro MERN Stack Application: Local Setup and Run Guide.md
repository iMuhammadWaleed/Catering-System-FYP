## CaterPro MERN Stack Application: Local Setup and Run Guide

Congratulations! The entire CaterPro MERN stack application has been pushed to your GitHub repository: `https://github.com/iMuhammadWaleed/Catering-System-FYP`.

This guide will walk you through setting up and running both the backend (Node.js/Express/MongoDB) and frontend (React) components on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Git**: For cloning the repository.
    *   [Download Git](https://git-scm.com/downloads)
2.  **Node.js & npm (or Yarn)**: For running JavaScript applications.
    *   [Download Node.js (includes npm)](https://nodejs.org/en/download/)
    *   Alternatively, install [Yarn](https://yarnpkg.com/)
3.  **MongoDB**: The database for the backend.
    *   [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
    *   [MongoDB Compass](https://www.mongodb.com/products/compass) (optional, but recommended GUI tool)

### Step 1: Clone the Repository

First, clone the project from your GitHub repository to your local machine:

```bash
git clone https://github.com/iMuhammadWaleed/Catering-System-FYP.git
cd Catering-System-FYP
```

### Step 2: Backend Setup

Navigate into the `backend` directory and set up the Node.js server.

1.  **Navigate to Backend:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory. You can use the provided `.env.example` as a template.

    ```bash
    cp .env.example .env
    ```

    Open the newly created `.env` file and configure your MongoDB connection string and JWT secret. For local development, you might use something like:

    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/caterpro_db
    JWT_SECRET=your_jwt_secret_key_here
    # Add other environment variables as needed, e.g., for email services, etc.
    ```

    **Important**: Ensure your MongoDB server is running. If you installed MongoDB locally, you typically start it via `mongod` command or as a service.

4.  **Run the Backend Server:**
    ```bash
    npm start
    # or yarn start
    ```
    The backend server should now be running, typically on `http://localhost:5000` (or the PORT you specified).

### Step 3: Frontend Setup

Open a **new terminal window** (keep the backend server running in the first terminal) and navigate into the `frontend` directory.

1.  **Navigate to Frontend:**
    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure Environment Variables (Frontend):**
    Create a `.env` file in the `frontend` directory.

    ```bash
    touch .env
    ```

    Open the `.env` file and add the backend API URL. For local development, this would typically be:

    ```
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4.  **Run the Frontend Application:**
    ```bash
    npm start
    # or yarn start
    ```
    The React development server will start, and your browser should automatically open `http://localhost:3000` (or another available port).

### Step 4: Access the Application

Once both the backend and frontend servers are running, you can access the CaterPro application in your web browser at:

`http://localhost:3000`

### Important Notes and Troubleshooting

*   **MongoDB Connection**: If you have issues connecting to MongoDB, ensure `mongod` is running and the `MONGO_URI` in your backend `.env` file is correct.
*   **Port Conflicts**: If either the backend (5000) or frontend (3000) ports are already in use, you might see an error. You can change the `PORT` in the backend `.env` file or let the React dev server suggest an alternative port.
*   **CORS Issues**: The backend is configured with CORS, but if you encounter issues, double-check the CORS settings in `backend/server.js`.
*   **Initial Data**: The database will be empty initially. You might need to implement seeders or manually register a caterer and a user through the application's registration forms to get started.
*   **Image Paths**: The image paths in the frontend components assume the `img` folder is accessible. Ensure your React app is configured to serve static assets correctly (e.g., by placing the `img` folder in the `public` directory of your React app, or configuring a static file server).
*   **Authentication**: Remember to register a user and a caterer to test the login and dashboard functionalities.
*   **Dependencies**: If `npm install` or `yarn install` fails, ensure your Node.js version is compatible and try clearing your npm/yarn cache.

If you encounter any specific issues, feel free to ask, and I'll do my best to assist you!

---

**Remember to revoke the GitHub Personal Access Token you provided once you have successfully cloned the repository and confirmed the project is working locally.**

