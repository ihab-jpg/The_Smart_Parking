# The Smart Parking

Smart Parking is a full-stack parking management project with a Spring Boot backend and a React/Vite frontend. The app supports user registration and login, a multi-level parking dashboard, parking filters, quick-exit views, accessibility-related data models, and MySQL-backed persistence.

## Project Structure

- `backend/` - Spring Boot API, JPA models, authentication, parking endpoints, and MySQL configuration.
- `frontend/` - React + Vite + Tailwind user interface.
- `frontend/src/components/ParkingMap2D.jsx` - interactive parking map layout.
- `frontend/src/pages/RegisterPage.jsx` - registration page connected to the backend.

## Requirements

- Java 21+
- Maven
- MySQL Server 8.x
- Node.js/npm, or the local portable Node setup if present on the machine

## Database Setup

The backend expects a local MySQL database:

```sql
CREATE DATABASE IF NOT EXISTS ParkingDB;
```

Default local credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ParkingDB?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`, so tables are created or updated automatically when the backend starts.

## Run Backend

```powershell
cd "backend"
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080/api
```

Quick test:

```text
http://localhost:8080/api/parking/levels
```

## Run Frontend

```powershell
cd "frontend"
npm install
npm run dev -- --host 127.0.0.1
```

Frontend URL:

```text
http://localhost:5173
```

If using the local portable Node folder that was set up on the development machine:

```powershell
cd "frontend"
$env:PATH = "C:\Users\Charbel Jamous\Desktop\Projects\The_Smart_Parking\.tools\node;" + $env:PATH
..\.tools\node\npm.cmd run dev -- --host 127.0.0.1
```

## Current Notes

- MySQL contains migrated local users from the previous H2 database.
- The frontend parking map is connected to backend parking endpoints.
- Parking spots use a visual `X-###` style label.
- Elevator and exit markers are treated as non-parking facilities.
- The old H2 database files and portable tooling are intentionally ignored and should not be committed.
