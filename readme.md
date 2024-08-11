### README.md

# Student Assignment Management API

This project is a Node.js and Express-based API for managing student assignments. It includes features like user authentication, assignment creation, retrieval, updating, and deletion. The project uses SQLite as the database and JWT for authentication.

## Hosted Link

https://playpower-backend.onrender.com

## Drive link of zip code and demonstration of project

https://drive.google.com/drive/u/1/folders/1QC7xWd6giTtTNdvMLkj3qwF_9LPq1QFm

## Features

- **User Authentication**: Users can register, log in, and retrieve user data.
- **Assignment Management**: Teachers can create, update, delete, and retrieve assignments.
- **JWT Authentication**: Secure endpoints using JSON Web Tokens.
- **SQLite Database**: Persistent data storage for users and assignments.

## Project Structure

- **app.js**: Main entry point for the API.
- **routes/**: Contains route definitions for authentication and assignment management.
- **controllers/**: Contains logic for handling requests and returning responses.
- **models/**: Defines the database schema and methods for interacting with the database.
- **middlewares/**: Contains middleware for authentication using JWT.
- **utils/**: Utility functions, including the database connection setup.

## Prerequisites

- Node.js
- SQLite3

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SSC369/playpower-backend-assignment.git
   cd playpower-backend-assignment/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set environment variables:**
   Create a `.env` file in the root directory and add the following:

   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   JWT_SECRET=your_secret_key
   ```

4. **Run the application:**

   ```bash
   node app.js
   ```

5. **Access the API:**
   The API will be running on `http://localhost:3000`.

## API Endpoints

- **Authentication**

  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/register`: Register a new user.
  - `GET /api/auth/users`: Retrieve all users.

- **Assignment Management**
  - `POST /api/assignments`: Create a new assignment (Teacher only).
  - `GET /api/assignments`: Retrieve all assignments.
  - `GET /api/teacher-assignments`: Retrieve assignments created by the logged-in teacher.
  - `PUT /api/update-assignment/:assignmentId`: Update an assignment (Teacher only).
  - `DELETE /api/delete-assignment/:assignmentId`: Delete an assignment (Teacher only).

## Docker Setup

To deploy this project using Docker, follow the steps below:

### 1. Create a Dockerfile

```Dockerfile
# Use the official Node.js 14 image as a parent image
FROM node:14

# Set environment variables
ENV EMAIL_USER=your_email@gmail.com
ENV EMAIL_PASS=your_gmail_app_password
ENV JWT_SECRET=your_jwt_secret

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) files
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "app.js"]
```

### 2. Build the Docker Image

Run the following command in the project directory:

```bash
docker build -t assignment-management-api .
```

### 3. Run the Docker Container

Once the image is built, you can run the container using:

```bash
docker run -p 3000:3000 -d assignment-management-api
```

This will start the application in a Docker container, and it will be accessible on `http://localhost:3000`.

### 4. Push Docker Image to Docker Hub

To push your Docker image to Docker Hub, follow these steps:

1. **Log in to Docker Hub:**

   ```bash
   docker login
   ```

   Enter your Docker Hub username and password when prompted.

2. **Tag your Docker image:**
   Replace `your_dockerhub_username` with your Docker Hub username.

   ```bash
   docker tag assignment-management-api your_dockerhub_username/assignment-management-api:latest
   ```

3. **Push the Docker image to Docker Hub:**

   ```bash
   docker push your_dockerhub_username/assignment-management-api:latest
   ```

4. **Verify the Push:**
   You can verify that the image is successfully pushed by visiting your Docker Hub repository.
