# HireVision

**HireVision** is a comprehensive Interview Management System designed to streamline the recruitment process for organizations. It enhances efficiency, provides better scheduling options, and offers a collaborative experience for interviewers, candidates, and recruiters.

---

## Live URL: https://hirevision-rest.onrender.com/

---

## Features

- **Centralized Scheduling**: Manage and coordinate interviews seamlessly with a user-friendly calendar view.
- **Efficient Filtering**: Filter interviews by date, status, and job roles.
- **Interviewer Management**: Assign interviewers based on business areas and roles.
- **Real-Time Updates**: Track changes to interview schedules instantly.
- **Secure Authentication**: User sign-up and login with hashed passwords and JWT authentication.
- **Mobile & Desktop-Friendly**: Fully responsive design for all devices.

---

## Installation

### Prerequisites

- **Node.js** (v18.20.4)
- **PostgreSQL** (>= 12.x)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HireVision.git
   cd HireVision

2. Install dependencies:
   npm install

3. Set up the environment variables: Create a .env file in the root directory with the following keys:
   PORT=3000
   DB_HOST=your-database-host
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   JWT_SECRET=your-secret-key

4. Run database migrations:
   npx sequelize-cli db:migrate

5. Start the server:
   npm start

The server will run on http://localhost:3000
Or use the live REST URL: https://hirevision-rest.onrender.com/


## API Documentation

## Health Check
- **GET** `/healthz` - Check if the server is running.

---

### Authentication
- **POST** `/api/auth/signup` - Register a new interviewer.
- **POST** `/api/auth/login` - Authenticate an interviewer and receive a JWT token.
- **POST** `/api/auth/logout` - Log out the current user (handled client-side).

---

### Business Areas
- **GET** `/api/businessareas` - Retrieve all business areas.
- **POST** `/api/businessareas` - Create a new business area.
- **GET** `/api/businessareas/:id` - Retrieve a specific business area by ID.
- **PUT** `/api/businessareas/:id` - Update a specific business area by ID.
- **DELETE** `/api/businessareas/:id` - Delete a specific business area by ID.

---

### Jobs
- **GET** `/api/jobs` - Retrieve all jobs.
- **POST** `/api/jobs` - Create a new job.
- **POST** `/api/jobs/search` - Search for jobs by title.
- **GET** `/api/jobs/:id` - Retrieve a specific job by ID.
- **PUT** `/api/jobs/:id` - Update a specific job by ID.
- **DELETE** `/api/jobs/:id` - Delete a specific job by ID.

---

### Tags
- **GET** `/api/tags` - Retrieve all tags.
- **POST** `/api/tags` - Create a new tag.
- **GET** `/api/tags/:id` - Retrieve a specific tag by ID.
- **PUT** `/api/tags/:id` - Update a specific tag by ID.
- **DELETE** `/api/tags/:id` - Delete a specific tag by ID.

---

### Interviewees
- **GET** `/api/interviewees` - Retrieve all interviewees.
- **POST** `/api/interviewees` - Create a new interviewee.
- **POST** `/api/interviewees/search` - Search interviewees by name or email.
- **GET** `/api/interviewees/:id` - Retrieve a specific interviewee by ID.
- **PUT** `/api/interviewees/:id` - Update a specific interviewee by ID.
- **DELETE** `/api/interviewees/:id` - Delete a specific interviewee by ID.

---

### Interviewers
- **GET** `/api/interviewers` - Retrieve all interviewers.
- **POST** `/api/interviewers` - Create a new interviewer.
- **POST** `/api/interviewers/search` - Search interviewers by name or email.
- **GET** `/api/interviewers/:id` - Retrieve a specific interviewer by ID.
- **PUT** `/api/interviewers/:id` - Update a specific interviewer by ID.
- **DELETE** `/api/interviewers/:id` - Delete a specific interviewer by ID.

---

### Interviews
- **GET** `/api/interviews` - Retrieve all interviews.
- **POST** `/api/interviews` - Create a new interview.
- **GET** `/api/interviews/:id` - Retrieve a specific interview by ID.
- **PUT** `/api/interviews/:id` - Update a specific interview by ID.
- **DELETE** `/api/interviews/:id` - Delete a specific interview by ID.
- **POST** `/api/interviews/filteredInterview` - Retrieve interviews filtered by various criteria.

## Frontend Repository
https://github.com/fwaadahmad1/interview-manager-frontend
