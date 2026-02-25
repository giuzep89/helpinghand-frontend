# HelpingHand

HelpingHand is a proof-of-concept REST API built to achieve what most social networks nowadays lack: helping people truly connect better with each other. This is achieved by sharing help requests and activities to join together and discouraging the creation of closed-groups: openness is key.

Being a proof-of-concept, trying out this application may prove rather complex for non-technical users, but hopefully the steps to take are explanatory enough to be followed without much hassle.

You may choose to run this API with the frontend I built for it, but it's also possible to just test the endpoints with a platform like Postman. You'll find the link to a Postman collection at the end of this readme.

Are you a non-technical person and all this gibberish is making your head spin?  Apologies...the project will get easier to run, I promise! The sections you need are Introduction, Downloads, Installation, and Running the Application. Good luck! And don't hesitate to pop me a message if you need any support.

Links to both repositories:

https://github.com/giuzep89/helpinghand-frontend
https://github.com/giuzep89/helpinghand-backend

## Table of Contents

- [Introduction](#introduction)
- [Downloads](#downloads)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Default Users](#default-users)
- [API Documentation](#api-documentation)

## Introduction

These are the functionalities you can expect when using this API:

- **User Management** - Registration, authentication, profile management, profile pictures
- **Help Requests** - The core part of this API: users can post requests for help in 14 different categories (gardening, IT support, taxes, etc.)
- **Activities** - Users can organize and join community activities (sports, culture, volunteering, etc.)
- **Messaging** - Private chat functionality between users
- **Friends** - Users can connect with others to see their posts in their feed
- **Prizes** - The cherry on top: funny prizes that users can award others for helping each other. The tone is kept purposely light-hearted not to take this too seriously

The API uses JWT authentication and role-based authorization with two roles: `ROLE_USER` and `ROLE_ADMIN`.

## Downloads

Before running this application, you're going to need to download the following:

| Software | Version | Download |
|----------|---------|----------|
| Java JDK | Amazon Corretto 21 | [Amazon Corretto](https://aws.amazon.com/corretto/) |
| Node.js | 18 or higher (22 recommended) | [Node.js](https://nodejs.org/) |
| PostgreSQL | 14 or higher | [PostgreSQL](https://www.postgresql.org/download/) |
| pgAdmin | 4 or higher | Included with PostgreSQL |
| IntelliJ IDEA | Latest | [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) |
| WebStorm | Latest | [WebStorm](https://www.jetbrains.com/webstorm/download/) |
| Postman | Latest (optional) | [Postman](https://www.postman.com/downloads/) |

NOTE: Intellij would probably prompt you to download the JDK after cloning the project, but I still recommend installing it beforehand to avoid any issue

## Project Structure

The application consists of three main components:

- **Frontend** - React single-page application that handles the user interface
- **Backend** - Spring Boot REST API that handles business logic and authentication
- **Database** - PostgreSQL database that stores all application data

### Backend

```
com.giuzep89.helpinghandbackend/
├── controllers/    # REST endpoints (PostController, UserController, etc.)
├── services/       # Business logic layer
├── repositories/   # Spring Data JPA interfaces
├── models/         # JPA entities (User, Post, Chat, Message, etc.)
├── dtos/           # Input/Output DTOs with validation
├── mappers/        # Entity-DTO conversion
├── exceptions/     # Custom exceptions + global handler
└── security/       # JWT auth (JwtService, filters, config)
```

### Frontend

```
src/
├── components/     # React components
├── context/        # React Context (AuthContext)
├── constants/      # Activity types, help types enums
├── helpers/        # API calls, token handling, utilities
├── pages/          # Page components (home, friends, messages, profile, login)
├── assets/         # Static assets (images, icons)
├── App.jsx         # Main App component with routing
└── main.jsx        # React entry point
```

## Technologies

### Backend

| Category | Technology |
|----------|------------|
| Framework | Spring Boot 4.0.1 |
| Language | Java 21 |
| Build Tool | Maven |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT (JJWT 0.13.0) |
| Validation | Jakarta Validation |
| Testing | JUnit 5, Mockito, Spring Boot Test |

### Frontend

| Category | Technology |
|----------|------------|
| Framework | React 19.2.0 |
| Build Tool | Vite 7.2.4 |
| Routing | React Router DOM 7.13.0 |
| Forms | React Hook Form 7.71.1 |
| HTTP Client | Axios 1.13.4 |
| Auth | jwt-decode 4.0.0 |

## Installation

### Step 1: Install the IDEs

Install IntelliJ IDEA (for the backend) and WebStorm (for the frontend) from JetBrains. The Community edition of IntelliJ IDEA is free and sufficient for this project.

NOTE: Did you intend to just test the endpoints? No need to install WebStorm!

### Step 2: Install PostgreSQL

Install PostgreSQL from the official website. The installer includes pgAdmin, which you'll use to manage the database.

### Step 3: Clone both repositories

For each repository, first copy the SSH link from GitHub:

1. Go to the repository page on GitHub
2. Click the green **Code** button
3. Select **SSH** and copy the link

Then clone in the IDE:

1. Open IntelliJ IDEA (for backend) or WebStorm (for frontend)
2. From the welcome screen, click **Get from VCS** (or File → New → Project from Version Control)
3. Paste the SSH link and choose a directory
4. Click **Clone**

NOTE: If Webstorm prompts you to run npm install, go ahead and do it! If it's succesful, you can skip step 6.

Repository links:
- Backend: `https://github.com/giuzep89/helpinghand-backend`
- Frontend: `https://github.com/giuzep89/helpinghand-frontend`

### Step 4: Create the database

Open pgAdmin and create a new database:

- Database name: `helpinghand`
- Owner: `postgres` (or your PostgreSQL user)

### Step 5: Set environment variables for the backend

For the non-technical user: this is a required step for security reasons.
The backend requires two environment variables; the PostgreSQL password is the one you'll be setting up after opening pgAdmin for the first time:

| Variable | Description |
|----------|-------------|
| `POSTGRESQL_PASSWORD` | Your PostgreSQL password |
| `JWT_SECRET` | Base64-encoded secret key for JWT signing (min 256 bits) |

1. Open Intellij
2. Go to the Menu bar -> Run → Edit Configurations
3. Select your Spring Boot configuration on the left (it should show the name of the app)
4. You should see "Environment variables" in this same window, but should it not be the case, click on "Modify options" and select Environment variables in the resulting drop-down menu

5. Add this line in the Environment variable input field, replacing the lowercase "password" with whichever password you set up earlier in pgAdmin:

```
   POSTGRESQL_PASSWORD=password;JWT_SECRET=dGhpc2lzYXZlcnlsb25nc2VjcmV0a2V5Zm9yand0dGhhdGlzYXRsZWFzdDI1NmJpdHNsb25n
```

6. Apply -> Ok

### Step 6: Install frontend dependencies

After having cloned the project in WebStorm as described earlier, with the project open in front of you, open the terminal and type the following, then hit enter:

```
npm install
```

## Running the Application

**Important:** The backend needs to be started before the frontend!

### Start the Backend

Using IntelliJ IDEA:
1. Open the project if you don't have it in front of you already
2. Wait for Maven to download dependencies (it'll show some activity in the bottom right corner of the window)
3. Run `EindopdrachtApplication.java` by clicking the play button at the top of the window
3a. You can also run it by typing the following in the terminal:

```bash
./mvnw spring-boot:run
```

The backend starts on `http://localhost:8080`.

### Start the Frontend

Using WebStorm:
1. Open the project if you don't have it in front of you already
2. Run `npm dev` by clicking the play button at the top of the window
2a. You can also run it by typing the following in the terminal:

```bash
npm run dev
```

The frontend starts on `http://localhost:5173`.

### Try it out!

1. Open `http://localhost:5173` in your browser
2. Log in with username `maria_visser` and password `password123`
3. You should see the home feed with sample posts
4. Enjoy!

## Running Tests

The backend includes unit tests and integration tests.

### Run all tests

From the terminal:

```bash
cd helpinghand-backend
./mvnw test
```

### Run tests in IntelliJ

Right-click the `src/test/java` folder and select **Run 'All Tests'**.

### Test overview

| Test Class | Type | Description |
|------------|------|-------------|
| `PostServiceTest` | Unit | 21 tests for post-related business logic |
| `ChatServiceTest` | Unit | 13 tests for chat-related business logic |
| `PostControllerIntegrationTest` | Integration | End-to-end test for post creation |
| `ChatMessagingControllerIntegrationTest` | Integration | End-to-end test for chat creation |

Tests use an H2 in-memory database (configured in `application-test.properties`).

## Default Users

The application loads sample data on startup with the following test users:

| Username | Password | Roles |
|----------|----------|-------|
| `jan_de_bakker` | password123 | ROLE_ADMIN, ROLE_USER |
| `maria_visser` | password123 | ROLE_USER |
| `piet_jansen` | password123 | ROLE_USER |
| `anna_smit` | password123 | ROLE_USER |
| `kees_de_vries` | password123 | ROLE_USER |

### Authorization levels

| Role | Permissions |
|------|-------------|
| `ROLE_USER` | Create posts, join activities, send messages, manage own profile and friends |
| `ROLE_ADMIN` | All user permissions + delete any post + delete any user + view all users |

NOTE: in the frontend, due to time constraints the admin functions are limited to deleting all posts in the home feed.

## API Documentation

For detailed API documentation including all endpoints, request/response examples, and authorization requirements, see the [API Documentation](./API-DOCUMENTATION.md).

A Postman collection is available for testing:
[Open Postman Collection](https://g-rinaldimusic-3684479.postman.co/workspace/Giuseppe-Rinaldi's-Workspace~38d83f03-d8de-4020-800b-95c7e2edb23f/collection/48296619-60adefff-770b-40af-b939-253248f68b5f?action=share&creator=48296619)
