# Smart Parking - Java Spring Boot Backend

Complete Spring Boot backend for the Smart Parking System with MySQL database integration.

## Project Structure

```
java-backend/
├── src/
│   ├── main/
│   │   ├── java/com/smartparking/
│   │   │   ├── models/              # JPA Entity classes
│   │   │   ├── repositories/        # Spring Data JPA repositories
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── services/            # Business logic (TODO)
│   │   │   ├── controllers/         # REST API controllers (TODO)
│   │   │   └── SmartParkingApplication.java  # Main entry point
│   │   └── resources/
│   │       └── application.yml      # Spring Boot configuration
│   └── test/                        # Unit tests (TODO)
├── pom.xml                          # Maven configuration
└── README.md
```

## Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **MySQL 8.0+**
- **IDE** (IntelliJ IDEA or VS Code with Java extensions)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Maven (if not already installed)
# macOS: brew install maven
# Windows: choco install maven
# Linux: apt-get install maven

mvn --version  # Verify installation
```

### 2. Create MySQL Database

```bash
mysql -u root -p -e "CREATE DATABASE smart_parking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Configure Application

Edit `src/main/resources/application.yml`:

```yaml
datasource:
  username: root           # Your MySQL username
  password: your_password  # Your MySQL password
```

Set environment variables for external services:

```bash
export TWILIO_ACCOUNT_SID=your_twilio_account_sid
export TWILIO_AUTH_TOKEN=your_twilio_auth_token
export TWILIO_PHONE_NUMBER=your_twilio_phone_number
export STRIPE_SECRET_KEY=your_stripe_secret_key
export STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Build the Project

```bash
mvn clean install
```

### 5. Run the Application

```bash
mvn spring-boot:run
```

Or run directly:

```bash
java -jar target/smart-parking-backend-1.0.0.jar
```

The application will start at `http://localhost:8080/api`

## Database Models

✅ **Implemented Entities:**
- User
- Admin
- ParkingLot
- ParkingLevel
- Row (for camera-based scanning)
- ParkingSpot
- Reservation
- Payment
- Rating
- ContactRequest
- SMSAlert

All models include proper:
- Primary keys & foreign keys
- Unique constraints & indexes
- Timestamps (createdAt, updatedAt)
- Relationships with cascading

## TODO - Next Steps

1. **Create Service Classes** - Business logic layer
   - UserService
   - ParkingLotService
   - ReservationService
   - PaymentService

2. **Create REST Controllers** - API endpoints
   - AuthController (login, register)
   - ParkingController (spots, availability)
   - ReservationController
   - PaymentController
   - AdminController

3. **Add Security** - JWT authentication
   - JwtTokenProvider
   - JwtAuthenticationFilter
   - SecurityConfig

4. **Implement External Services**
   - Twilio SMS integration
   - Stripe payment integration
   - Camera/AI data processing

5. **Add Unit Tests**
   - Repository tests
   - Service tests
   - Controller tests

## API Endpoints (TODO)

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /parking/lots` - List all parking lots
- `GET /parking/spots/{lotId}` - Get available spots
- `POST /reservations` - Create reservation
- `GET /reservations/{userId}` - Get user reservations
- `POST /payments` - Process payment
- `POST /ratings` - Submit rating

## Database Diagram

```
User ──┬── Reservation ──┬── Payment
       ├── Rating        │
       ├── ContactRequest ─── Admin
       └── SMSAlert

ParkingLot ──┬── ParkingLevel ──┬── Row ──── ParkingSpot
             ├── Reservation    │
             ├── Payment        └── (relationships)
             └── Rating
```

## Development Tips

- Use `mvn clean install -DskipTests` to skip tests during build
- Set `ddl-auto: validate` in production
- Use `@Transactional` for service methods
- Add `@Valid` annotation for request validation
- Use DTOs for API responses

## Troubleshooting

**Connection refused error:**
- Ensure MySQL is running
- Check database credentials in `application.yml`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Port 8080 already in use:**
- Change port in `application.yml`: `server.port: 8081`

**JPA/Hibernate issues:**
- Clear `/target` directory: `mvn clean`
- Check entity relationships and annotations
- Verify column names match database schema

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Hibernate Documentation](https://hibernate.org/)
- [MySQL JDBC Driver](https://dev.mysql.com/doc/connector-j/8.0/en/)

## License

Licensed under MIT License