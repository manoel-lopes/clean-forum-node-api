# Clean Architecture Forum API

This project is a robust RESTful API for a forum application, built with Node.js, Fastify, and TypeScript. It follows the principles of Clean Architecture and Domain-Driven Design to create a scalable, maintainable, and testable codebase.


## 🛠️ Technologies

- [Node.js](https://nodejs.org/)
- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Redis](https://redis.io/)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [Docker](https://www.docker.com/)
- [Husky](https://typicode.github.io/husky/)


## 🏛️ Architecture

### Clean Architecture

This project is structured following the principles of **Clean Architecture** by Robert C. Martin. This architectural style emphasizes the separation of concerns, creating a system that is independent of frameworks, UI, and databases.

![Clean Architecture Diagram](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

*Image courtesy of Robert C. Martin (Uncle Bob)*

The core of the application is built around the **Domain** and **Application** layers, which contain the business logic and are independent of any external frameworks. The outer layers, **Presentation** and **Infrastructure**, handle details like HTTP requests, database interactions, and other external services.

### Domain-Driven Design (DDD)

It uses concepts from **Domain-Driven Design** to model the business domain of the forum.

- **Entities**: Core objects of the domain with a unique identifier.
- **Value Objects**: Objects that represent a descriptive aspect of the domain without a conceptual identifier.


## 🏗️ Design Patterns

- **Adapter**: Converts the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.
- **Strategy**: Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.
- **Proxy**: Provides a surrogate or placeholder for another object to control access to it. The proxy implements the same interface as the real subject, so it can be used in place of the real object.
- **Simple Factory**: Centralizes object creation in a single place, instantiating concrete classes without exposing construction details to the client.
- **Static Factory Method**: A static factory method is a static method that returns an instance of its class, providing an alternative to using a public constructor. Instead of directly invoking `new`, clients call this method, which may hide complex creation logic, apply validation, cache instances, or return subtypes.
- **Mapper**: An object that sets up a bidirectional mapping between two different representations, such as between an in-memory object model and a database.
- **Layer Supertype**: An abstract superclass that provides shared common behavior for all subclasses in a logical layer.
- **Repository**: Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.

## 🧪 Test Patterns & Quality

### Test Structure (AAA Pattern)

All tests follow the **Arrange-Act-Assert (AAA)** pattern with visual separation using blank lines:

```typescript
it('should do something', async () => {
  // Arrange: setup test data and dependencies
  const entity = await createAndSave(makeEntity, repository, { prop: 'value' })
  const input = { id: entity.id, field: 'value' }

  // Act: execute the operation
  const result = await sut.execute(input)

  // Assert: verify expectations
  expectEntityToMatch(result, { expectedProp: 'value' })
})
```

### Test Patterns

- **In-Memory Database**: Unit and integration tests use in-memory repositories for fast, isolated testing
- **No Test Dependencies**: Each test creates its own data, avoiding shared state and `beforeAll` dependencies
- **Stubs**: Controlled, predictable behavior for external dependencies
- **Spies/Mocks**: Verify interactions between components
- **Factory Functions**: Generate consistent, repeatable test data
- **System Under Test (SUT)**: Consistent naming with `sut` variable for clarity
- **Test Data Builder**: Fluent API builders with method chaining for flexible test data creation

---

## 📂 Project Structure

```
clean-forum-node-api/
├── prisma/                                      # Database Schema & Migrations
│   ├── schemas/                                 # Multi-file Prisma schema organization
│   │   ├── user.prisma                          # User model and relations
│   │   ├── question.prisma                      # Question model and relations
│   │   ├── answer.prisma                        # Answer model and relations
│   │   ├── comment.prisma                       # Comment model
│   │   ├── attachment.prisma                    # Attachment model
│   │   └── refresh-token.prisma                 # Refresh token model
│   ├── migrations/                              # Database migration files
│   └── seed.ts                                  # Database seeding script
│
├── src/
│   ├── core/                                    # 🎯 Base Types & Abstractions
│   │   ├── domain/application/                  # UseCase interface, pagination types
│   │   └── presentation/                        # WebController interface, HTTP types
│   │
│   ├── domain/                                  # 🏛️ BUSINESS LOGIC (Clean Architecture Core)
│   │   │
│   │   ├── application/                         # Application Business Rules
│   │   │   ├── usecases/                        # Business operations (one per use case)
│   │   │   │   ├── answer-question/
│   │   │   │   ├── attach-to-answer/
│   │   │   │   ├── attach-to-question/
│   │   │   │   ├── authenticate-user/
│   │   │   │   ├── choose-question-best-answer/
│   │   │   │   ├── comment-on-answer/
│   │   │   │   ├── comment-on-question/
│   │   │   │   ├── create-account/
│   │   │   │   ├── delete-account/
│   │   │   │   ├── delete-answer/
│   │   │   │   ├── delete-answer-attachment/
│   │   │   │   ├── delete-answer-comment/
│   │   │   │   ├── delete-question/
│   │   │   │   ├── delete-question-attachment/
│   │   │   │   ├── delete-question-comment/
│   │   │   │   ├── fetch-question-answers/
│   │   │   │   ├── fetch-user-questions/
│   │   │   │   ├── get-question-by-slug/
│   │   │   │   ├── get-user-by-email/
│   │   │   │   ├── refresh-token/
│   │   │   │   ├── send-email-validation/
│   │   │   │   ├── update-account/
│   │   │   │   ├── update-answer/
│   │   │   │   ├── update-answer-attachment/
│   │   │   │   ├── update-comment/
│   │   │   │   ├── update-question/
│   │   │   │   ├── update-question-attachment/
│   │   │   │   └── verify-email-validation/       # (29 total use cases)
│   │   │   │
│   │   │   ├── repositories/                    # Repository interfaces (9 contracts)
│   │   │   │   ├── base/
│   │   │   │   ├── users.repository/
│   │   │   │   ├── questions.repository/
│   │   │   │   ├── question-attachments.repository/
│   │   │   │   ├── question-comments.repository/
│   │   │   │   ├── answers.repository/
│   │   │   │   ├── answer-attachments.repository/
│   │   │   │   ├── answer-comments.repository/
│   │   │   │   ├── refresh-tokens.repository/
│   │   │   │   └── email-validations.repository/
│   │   │   │
│   │   │   └── types/                           # Application types
│   │   │
│   │   └── enterprise/                          # Enterprise Business Rules
│   │       └── entities/                        # Core domain entities (9 entities)
│   │           ├── base/
│   │           ├── user/
│   │           ├── question/
│   │           ├── question-attachment/
│   │           ├── question-comment/
│   │           ├── answer/
│   │           ├── answer-attachment/
│   │           ├── answer-comment/
│   │           ├── refresh-token/
│   │           ├── email-validation/
│   │           └── value-objects/
│   │               ├── slug/
│   │               └── email-validation-code/
│   │
│   ├── presentation/                            # 🎨 INTERFACE ADAPTERS
│   │   ├── controllers/                         # HTTP Controllers (one per route)
│   │   │   ├── create-question/
│   │   │   │   ├── create-question.controller.ts
│   │   │   │   └── create-question.controller.test.ts
│   │   │   ├── answer-question/
│   │   │   ├── attach-to-answer/
│   │   │   ├── attach-to-question/
│   │   │   ├── authenticate-user/
│   │   │   ├── choose-question-best-answer/
│   │   │   ├── comment-on-answer/
│   │   │   ├── comment-on-question/
│   │   │   ├── create-account/
│   │   │   ├── delete-account/
│   │   │   ├── delete-answer/
│   │   │   ├── delete-answer-attachment/
│   │   │   ├── delete-comment/
│   │   │   ├── delete-question/
│   │   │   ├── delete-question-attachment/
│   │   │   ├── fetch-question-answers/
│   │   │   ├── fetch-questions/
│   │   │   ├── fetch-user-questions/
│   │   │   ├── fetch-users/
│   │   │   ├── get-question-by-slug/
│   │   │   ├── get-user-by-email/
│   │   │   ├── refresh-token/
│   │   │   ├── send-email-validation/
│   │   │   ├── update-answer/
│   │   │   ├── update-answer-attachment/
│   │   │   ├── update-comment/
│   │   │   ├── update-question/
│   │   │   ├── update-question-attachment/
│   │   │   └── verify-email-validation/         # (29 total controllers)
│   │   │
│   │   └── helpers/                             # HTTP response helpers
│   │
│   ├── infra/                                   # ⚙️ FRAMEWORKS & DRIVERS
│   │   │
│   │   ├── adapters/                            # External service adapters
│   │   │   ├── email/
│   │   │   │   ├── ports/                       # Email service interface
│   │   │   │   ├── services/                    # Nodemailer implementation
│   │   │   │   └── templates/                   # Email templates (Handlebars)
│   │   │   │       └── layouts/
│   │   │   │
│   │   │   └── security/
│   │   │       ├── ports/                       # Hash service interface
│   │   │       └── stubs/                       # Fake hasher for testing
│   │   │
│   │   ├── auth/                                # Authentication
│   │   │   └── jwt/                             # JWT service & errors
│   │   │
│   │   ├── http/                                # HTTP Framework (Fastify)
│   │   │   ├── errors/
│   │   │   ├── fallback/                        # Global error handler
│   │   │   ├── helpers/
│   │   │   └── ports/
│   │   │
│   │   ├── persistence/                         # Data Persistence
│   │   │   ├── prisma/
│   │   │   ├── factories/
│   │   │   │
│   │   │   ├── mappers/                         # Data transformation
│   │   │   │   ├── prisma/                      # 5 Prisma mappers
│   │   │   │   └── cached/                      # 3 Cached mappers
│   │   │   │       └── base/
│   │   │   │
│   │   │   └── repositories/                    # Repository implementations
│   │   │       ├── prisma/                      # Production (PostgreSQL) - 9 repos
│   │   │       │   ├── base/
│   │   │       │   ├── users/
│   │   │       │   ├── questions/
│   │   │       │   ├── question-attachments/
│   │   │       │   ├── question-comments/
│   │   │       │   ├── answers/
│   │   │       │   ├── answer-attachments/
│   │   │       │   ├── answer-comments/
│   │   │       │   ├── refresh-tokens/
│   │   │       │   └── email-validations/
│   │   │       │
│   │   │       ├── in-memory/                   # Testing (In-Memory) - 9 repos
│   │   │       │   ├── base/
│   │   │       │   ├── users/
│   │   │       │   ├── questions/
│   │   │       │   ├── question-attachments/
│   │   │       │   ├── question-comments/
│   │   │       │   ├── answers/
│   │   │       │   ├── answer-attachments/
│   │   │       │   ├── answer-comments/
│   │   │       │   ├── refresh-tokens/
│   │   │       │   └── email-validations/
│   │   │       │
│   │   │       └── cached/                      # Production (Redis) - 3 repos
│   │   │           ├── users/
│   │   │           ├── questions/
│   │   │           └── answers/
│   │   │
│   │   ├── providers/                           # Infrastructure providers
│   │   │   └── cache/                           # Redis service
│   │   │
│   │   ├── queue/                               # Background jobs (deprecated)
│   │   │   └── workers/
│   │   │
│   │   ├── queues/                              # BullMQ queues (current)
│   │   │   └── email/                           # Email queue consumer & service
│   │   │
│   │   ├── validation/                          # Request validation
│   │   │   ├── errors/
│   │   │   ├── ports/
│   │   │   └── zod/
│   │   │       ├── config/                      # Custom error messages
│   │   │       ├── helpers/
│   │   │       └── schemas/                     # Zod validation schemas
│   │   │           ├── core/                    # pagination, uuid
│   │   │           ├── domain/                  # email, slug
│   │   │           ├── presentation/
│   │   │           │   ├── questions/
│   │   │           │   ├── answers/
│   │   │           │   ├── users/
│   │   │           │   ├── sessions/
│   │   │           │   ├── comments/
│   │   │           │   └── attachments/
│   │   │           └── util/
│   │   │               └── functions/
│   │   │
│   │   └── doubles/                             # Test doubles
│   │
│   ├── main/                                    # 🔧 COMPOSITION ROOT (Dependency Injection)
│   │   ├── factories/                           # 29 controller factories
│   │   │
│   │   ├── fastify/                             # Fastify configuration
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── helpers/                         # Rate limit config
│   │   │   ├── middlewares/                     # Auth middleware
│   │   │   ├── plugins/                         # Error handler, CORS, Swagger
│   │   │   └── routes/                          # Route registration
│   │   │       ├── questions/
│   │   │       ├── answers/
│   │   │       ├── users/
│   │   │       ├── session/
│   │   │       ├── comments/
│   │   │       └── attachments/
│   │   │
│   │   └── server.ts                            # Application entry point
│   │
│   ├── shared/                                  # 🔄 SHARED UTILITIES (Cross-cutting)
│   │   ├── application/
│   │   │   └── errors/                          # Shared errors
│   │   │
│   │   ├── types/                               # TypeScript utilities
│   │   │   ├── common/                          # Props, Optional, Mutable, NonNullable
│   │   │   └── custom/
│   │   │
│   │   └── util/                                # Utility functions
│   │       ├── factories/domain/                # Test data factories
│   │       ├── http/                            # adapt-route, extract-token
│   │       ├── auth/                            # get-authenticated-user-id
│   │       └── test/                            # Test helpers
│   │
│   ├── lib/                                     # 📚 REUSABLE LIBRARIES
│   │   ├── env/                                 # Environment configuration
│   │   └── cache/                               # Cache utilities
│   │
│   └── types/                                   # Global TypeScript definitions
│
├── tests/                                       # 🧪 END-TO-END TESTS
│   ├── e2e/                                     # E2E test suites
│   │   ├── create-question.e2e.test.ts
│   │   ├── fetch-questions.e2e.test.ts
│   │   ├── get-question-by-slug.e2e.test.ts
│   │   ├── answer-question.e2e.test.ts
│   │   ├── fetch-question-answers.e2e.test.ts
│   │   ├── authenticate-user.e2e.test.ts
│   │   ├── create-account.e2e.test.ts
│   │   ├── send-email-validation.e2e.test.ts
│   │   ├── verify-email-validation.e2e.test.ts
│   │   └── ... (31 test files, 213 tests total)
│   │
│   ├── builders/                                # Test Data Builders (Fluent API)
│   │   ├── user.builder.ts
│   │   ├── question.builder.ts
│   │   ├── answer.builder.ts
│   │   └── ...
│   │
│   └── helpers/                                 # Test Helper Functions
│       ├── domain/                              # Domain-specific helpers
│       │   ├── question-helpers.ts
│       │   ├── answer-helpers.ts
│       │   ├── user-helpers.ts
│       │   └── comment-helpers.ts
│       ├── auth/
│       │   └── auth-helpers.ts
│       ├── prisma/
│       │   └── setup-test-database.ts
│       └── infra/
│           ├── test-app.ts
│           ├── email-helpers.ts
│           └── queue-helpers.ts
│
├── .env.example                                 # Example environment variables
├── .env.development                             # Development environment config
├── .env.test                                    # Test environment config
├── docker-compose.development.yml               # Dev containers (DB:5432, Redis:6379)
├── docker-compose.test.yml                      # Test containers (DB:5433, Redis:6377)
├── tsconfig.json                                # TypeScript configuration
├── eslint.config.mjs                            # ESLint configuration (neostandard)
├── vitest.config.ts                             # Vitest test configuration
├── .lintstagedrc.mjs                            # Lint-staged configuration
├── .husky/                                      # Git hooks
│   └── pre-commit                               # Pre-commit hook
└── package.json                                 # Dependencies and scripts
```


## 🚀 Setup & Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm
- Docker and Docker Compose

### Installation Steps

1.  **Clone the repository.**
2.  **Install dependencies** using `pnpm install`.
3.  **Set up development environment variables** by copying `.env.example` to `.env.development` and filling it with your database credentials.
    Example `.env.development`:
    ```
    DB_USER=<your_db_user>
    DB_PASSWORD=<your_db_password>
    DB_NAME=<your_db_name>
    DB_PORT=<your_db_port>
    ```
4.  **Start the database and Redis** using the provided `pnpm` script:
    ```bash
    pnpm run db:up:dev
    ```
5.  **Run database migrations** using the provided `pnpm` script:
    ```bash
    pnpm run migrate:dev
    ```

### Running the Application

-   **Development Mode**: `pnpm run start:dev`
-   **Production Mode**: `pnpm run build` and then `pnpm run start`

---

## 🧪 Testing

This project uses `vitest` for testing.

### Unit Tests

- **Run unit tests:**
  ```bash
  pnpm test:unit
  ```

### E2E Tests

The E2E (End-to-End) tests require a running PostgreSQL database. You can easily set one up using Docker Compose and the provided scripts.

**1. Set up the Test Database**

- **Create a `.env.test` file** in the root of the project. You can copy the example credentials below.

  Example `.env.test`:
  ```
  DB_USER=docker
  DB_PASSWORD=docker
  DB_NAME=forum_test
  DB_PORT=5433
  ```

- **Start the test database** with the following command:

  ```bash
  pnpm run db:up:test
  ```

  This will start a PostgreSQL container in the background.

- **Run database migrations** for the test database:
  ```bash
  pnpm run migrate:test
  ```

**2. Run E2E tests**

- Once the test database is running, you can run the E2E tests:
  ```bash
  pnpm run test:e2e
  ```

### Test Coverage

- **Generate test coverage report:**
  ```bash
  pnpm test:ci
  ```

---

## 📖 API Documentation

###  Swagger Documentation

This project uses Swagger for interactive API documentation. Once the application is running, the Swagger UI can be accessed at:

[http://localhost:3333/docs](http://localhost:3333/docs)

### Rate Limiting

This API implements rate limiting to prevent abuse and ensure fair usage across different endpoints. Rate limits are automatically disabled in test environments.

#### Rate Limit Configuration

- **Authentication Endpoints** (`/auth`): 5 requests per minute per IP/email combination
- **User Creation Endpoints** (`/users`): 10 requests per minute per IP
- **Email Validation Endpoints** (`/send-email-validation`, `/users/verify-email-validation`): 3 requests per 5 minutes per IP/email combination

#### Rate Limit Headers

When rate limiting is active, responses include the following headers:
- `X-RateLimit-Limit`: The request limit per time window
- `X-RateLimit-Remaining`: Number of requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when the rate limit window resets
- `Retry-After`: Seconds to wait before retrying (included when limit is exceeded)

#### Rate Limit Error Response

When the rate limit is exceeded, the API returns a `429 Too Many Requests` status with details:

```json
{
  "code": "AUTH_RATE_LIMIT_EXCEEDED",
  "error": "Too Many Requests",
  "message": "Too many authentication attempts. Please try again later.",
  "retryAfter": 60
}
```

Error codes by endpoint type:
- `AUTH_RATE_LIMIT_EXCEEDED`: Authentication endpoints
- `USER_CREATION_RATE_LIMIT_EXCEEDED`: User creation endpoints  
- `EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED`: Email validation endpoints

### Authentication

Most routes require authentication using an JWT Token.

## Session

### Authenticates a user

*   **Method:** `POST`
*   **Path:** `/auth`
*   **Description:** Authenticates a user by verifying their email and password. If the credentials are correct, it returns a JWT token and a refresh token. This allows the user to access protected routes and to stay logged in.

**Request Body:**

```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "refreshToken": {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "userId": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
    "expiresAt": "2025-08-14T10:00:00.000Z"
  }
}
```

---

### Refresh access token

*   **Method:** `POST`
*   **Path:** `/refresh-token`
*   **Description:** Refreshes an expired JWT token using a valid refresh token. This allows the user to maintain their session without having to log in again.

**Request Body:**

```json
{
  "refreshTokenId": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```


## Users

### Creates a new user account

*   **Method:** `POST`
*   **Path:** `/users`
*   **Description:** Creates a new user account. It checks if the email is already registered and hashes the password before saving the user to the database.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Response:**

*   **Status:** `201 Created`
*   **Body:** `null`

---

### Fetches a single user by email

*   **Method:** `GET`
*   **Path:** `/users/:email`
*   **Description:** Fetches a single user by their email address. This is useful for checking if a user exists or for retrieving user information.

**URL Parameters:**

```
email=john.doe@example.com
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "id": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2025-08-14T10:00:00.000Z"
}
```

---

### Deletes a user account

*   **Method:** `DELETE`
*   **Path:** `/users`
*   **Description:** Deletes a user account. This action also removes all the user's refresh tokens, effectively logging them out from all devices.

**Response:**

*   **Status:** `204 No Content`
*   **Body:** `null`

---

### Fetches a paginated list of users

*   **Method:** `GET`
*   **Path:** `/users`
*   **Description:** Fetches a paginated list of users. This is useful for administrative purposes, such as managing users.

**Query Parameters:**

```
page=1
pageSize=10
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "page": 1,
  "pageSize": 10,
  "totalItems": 100,
  "totalPages": 10,
  "items": [
    {
      "id": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "createdAt": "2025-08-14T10:00:00.000Z"
    }
  ]
}
```


## Questions

### Creates a new question

*   **Method:** `POST`
*   **Path:** `/questions`
*   **Description:** Creates a new question. It checks if a question with the same title already exists to avoid duplicates.

**Request Body:**

```json
{
  "title": "How to use Fastify?",
  "content": "I'm new to Fastify and need help with basic setup."
}
```

**Response:**

*   **Status:** `201 Created`
*   **Body:** `null`

---

### Fetches a paginated list of questions

*   **Method:** `GET`
*   **Path:** `/questions`
*   **Description:** Fetches a paginated list of questions. This allows users to browse through the existing questions.

**Query Parameters:**

```
page=1
pageSize=10
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "page": 1,
  "pageSize": 10,
  "totalItems": 100,
  "totalPages": 10,
  "items": [
    {
      "id": "b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a",
      "title": "How to create a slug from a string?",
      "slug": "how-to-create-a-slug-from-a-string",
      "authorId": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
      "createdAt": "2025-08-14T09:00:00.000Z",
      "updatedAt": "2025-08-14T09:00:00.000Z"
    }
  ]
}
```

---

### Fetches a single question by slug

*   **Method:** `GET`
*   **Path:** `/questions/:slug`
*   **Description:** Fetches a single question by its slug. The slug is a user-friendly version of the title, used for SEO-friendly URLs.

**URL Parameters:**

```
slug=how-to-create-a-slug-from-a-string
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "id": "b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a",
  "title": "How to create a slug from a string?",
  "content": "What is the best way to create a slug from a string in TypeScript?",
  "slug": "how-to-create-a-slug-from-a-string",
  "authorId": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
  "createdAt": "2025-08-14T09:00:00.000Z",
  "updatedAt": "2025-08-14T09:00:00.000Z",
  "answers": [
    {
      "id": "d9b9c9e0-9e0a-4b0e-9b0a-9e0a9b0e9b0a",
      "content": "This is an example answer.",
      "authorId": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
      "questionId": "b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a",
      "createdAt": "2025-08-14T10:00:00.000Z",
      "updatedAt": "2025-08-14T10:00:00.000Z"
    }
  ]
}
```

---

### Deletes a question

*   **Method:** `DELETE`
*   **Path:** `/questions/:questionId`
*   **Description:** Deletes a question. Only the author of the question can perform this action.

**URL Parameters:**

```
questionId=b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a
```

**Response:**

*   **Status:** `204 No Content`
*   **Body:** `null`

---

### Choose an answer as the best answer for a question

*   **Method:** `PATCH`
*   **Path:** `/questions/:answerId/choose`
*   **Description:** Marks an answer as the best answer for a question. Only the author of the question can perform this action. This helps other users to quickly find the most helpful answer.

**URL Parameters:**

```
answerId=d9b9c9e0-9e0a-4b0e-9b0a-9e0a9b0e9b0a
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "id": "b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a",
  "title": "How to create a slug from a string?",
  "content": "What is the best way to create a slug from a string in TypeScript?",
  "slug": "how-to-create-a-slug-from-a-string",
  "bestAnswerId": "d9b9c9e0-9e0a-4b0e-9b0a-9e0a9b0e9b0a",
  "createdAt": "2025-08-14T09:00:00.000Z",
  "updatedAt": "2025-08-14T10:00:00.000Z"
}
```

## Answers

### Answers a question

*   **Method:** `POST`
*   **Path:** `/answers/:questionId`
*   **Description:** Submits an answer to a specific question.

**URL Parameters:**

```
questionId=b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a
```

**Request Body:**

```json
{
  "content": "This is my answer to the question."
}
```

**Response:**

*   **Status:** `201 Created`
*   **Body:** `null`

---

### Fetches a paginated list of answers for a question

*   **Method:** `GET`
*   **Path:** `/answers/:questionId/answers`
*   **Description:** Fetches a paginated list of answers for a given question. This allows users to see all the answers for a specific question.

**URL Parameters:**

```
questionId=b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a
```

**Query Parameters:**

```
page=1
pageSize=10
```

**Response:**

*   **Status:** `200 OK`
*   **Body:**

```json
{
  "page": 1,
  "pageSize": 10,
  "totalItems": 100,
  "totalPages": 10,
  "items": [
    {
      "id": "d9b9c9e0-9e0a-4b0e-9b0a-9e0a9b0e9b0a",
      "content": "This is an example answer.",
      "authorId": "c8a8b8e0-8e0a-4b0e-8b0a-8e0a8b0e8b0a",
      "questionId": "b7a7b7e0-7e0a-4b0e-7b0a-7e0a7b0e7b0a",
      "createdAt": "2025-08-14T10:00:00.000Z",
      "updatedAt": "2025-08-14T10:00:00.000Z"
    }
  ]
}
```

---

### Deletes an answer

*   **Method:** `DELETE`
*   **Path:** `/answers/:answerId`
*   **Description:** Deletes an answer. Only the author of the answer can perform this action.

**URL Parameters:**

```
answerId=d9b9c9e0-9e0a-4b0e-9b0a-9e0a9b0e9b0a
```

**Response:**

*   **Status:** `204 No Content`
*   **Body:** `null`

## License

This project is licensed under the MIT License.
