# Equipment Management System
## Project Overview
This project is a comprehensive full-stack inventory and reservation management system. It is designed to provide a seamless interface for users to browse and reserve equipment while allowing administrators to manage the full lifecycle of inventory items.
The application is built as a decoupled, RESTful API architecture, ensuring clean separation between the frontend and backend layers.
## Key Technical Features
- Full-Stack Integration: A modern React frontend paired with a robust Spring Boot backend.
- Advanced Security: Implements stateless authentication using JSON Web Tokens (JWT).
- Secure Password Handling: Utilizes BCrypt hashing for all user credentials stored in the PostgreSQL database.
- State-Aware Interceptors: Custom Axios interceptors manage authentication headers dynamically. This ensures that the application remains secure across page refreshes and that API calls are only attempted once the token is verified and available.
- Role-Based Access Control (RBAC): The system distinguishes between ROLE_USER and ROLE_ADMIN, with both the UI and the backend API endpoints strictly enforcing these permissions.

## Technical Stack
- Frontend: React.js, Axios, CSS3
- Backend: Java, Spring Boot, Spring Security, Spring Data JPA
- Database: PostgreSQL
- Orchestration: Docker, Docker Compose

## Prerequisites
To run this demo, you must have the following installed on your machine:
- Docker Desktop
- Git

## How to Run the Demo
### 1. Clone the Repository
```
git clone https://github.com/MalowMakes/Inventory-System
cd <inventory-system>
```

### 2. Launch the Environment
The entire stack is containerized for easy setup. Run the following command in the root of the project:
```
docker-compose up --build
```

This command builds the images for the React frontend and Spring Boot backend, initializes the PostgreSQL database, and links them together on a private network.
### 3. Database Initialization
Upon startup, the system automatically executes the data.sql script located in the backend resources. This populates the database with:
- Pre-configured Admin and User accounts.
- Initial equipment inventory data.
### 4. Accessing the Application
Once the terminal indicates the containers are running:
- Web Interface: Navigate to http://localhost:5173
- Now you can login as different users, reserve items, modify items, and delete reservations!

# Development Notes
For demonstration purposes, the project is currently set to reset the database every time the docker container runs. If you wish to have the database stay persistent between runtimes, you must change the following line in **src/main/resources/application.properties**:
```
spring.sql.init.mode=always
```
INTO
```
spring.sql.init.mode=never
```