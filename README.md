# Clean Architecture Forum API

This project is a robust RESTful API for a forum application, built with Node.js, Fastify, and 
TypeScript. It follows the principles of Clean Architecture and Domain-Driven Design to create 
a scalable, maintainable, and testable codebase.


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
- **Repositories**: Provide an abstraction over data persistence, allowing the application layer to remain independent of the database technology.

## 🏗️ Design Patterns

- **Repository**: Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.
- **Factory**: Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.
- **Adapter**: Allows objects with incompatible interfaces to collaborate.
- **Strategy**: Defines a family of algorithms, puts each of them into a separate class, and makes their objects interchangeable.
- **Proxy**: Provides a substitute or placeholder for another object.
- **Abstract Factory**: Creates families of related objects without specifying their concrete classes.

## 🧪 Test Patterns

- **In-Memory Database**: For unit and integration tests, it uses in-memory repositories to replace the actual database. This provides a fast and isolated test environment.
- **Stubs**: It uses stubs to replace real implementations of certain modules (like use cases) with a controlled, predictable behavior during tests.
- **Spies/Mocks**: To verify interactions between different parts of the code, it uses spies and mocks to observe function calls and their arguments.
- **Fakes**: It uses factory functions to generate fake data for testing, ensuring consistent and repeatable test scenarios.

---

## 📂 Project Structure

```
├── prisma/               # Prisma schema, migrations, and seed scripts
├── src/
│   ├── application/      # Application-specific business rules (Use Cases)
│   ├── domain/           # Enterprise-wide business rules (Entities, Value Objects)
│   ├── infra/            # Frameworks, drivers, and external dependencies (DB, HTTP, etc.)
│   ├── main/             # Composition root, where everything is wired up
│   └── presentation/     # Controllers to handle HTTP requests and responses
├── .env.example          # Example environment variables
└── package.json          # Project dependencies and scripts
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm
- Docker and Docker Compose

### Installation Steps

1.  **Clone the repository.**
2.  **Install dependencies** using `pnpm install`.
3.  **Set up environment variables** by copying `.env.example` to `.env.development`.
4.  **Start the database and Redis** using the provided `pnpm` scripts (e.g., `pnpm db:up:dev`).
5.  **Run database migrations** using the provided `pnpm` scripts (e.g., `pnpm migrate:dev`).

### Running the Application

-   **Development Mode**: `pnpm start:dev`
-   **Production Mode**: `pnpm build` and then `pnpm start`

---

## 🧪 Testing

-   **Run unit tests:**
    ```bash
    pnpm test:unit
    ```

-   **Run E2E tests:**
    ```bash
    pnpm test:e2e
    ```

-   **Generate test coverage report:**
    ```bash
    pnpm test:ci
    ```

---

## 📖 API Documentation

###  Swagger Documentation

This project uses Swagger for interactive API documentation. Once the application is running, the Swagger UI can be accessed at:

[http://localhost:3333/docs](http://localhost:3333/docs)


### Authentication

Most routes require authentication using an JWT Token.

## Session

### Authenticates a user

*   **Method:** `POST`
*   **Path:** `/auth`
*   **Description:** Authenticates a user and returns a JWT token.

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

**Response:**

*   **Status:** `204 No Content`
*   **Body:** `null`

---

### Fetches a paginated list of users

*   **Method:** `GET`
*   **Path:** `/users`

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
  "updatedAt": "2025-08-14T09:00:00.000Z"
}
```

---

### Deletes a question

*   **Method:** `DELETE`
*   **Path:** `/questions/:questionId`

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
*   **Description:** Answers a question.

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
*   **Description:** Fetches a paginated list of answers for a question.

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
*   **Description:** Deletes an answer.

**URL Parameters:**

```
answerId=d9b9c9e0-9e0a-4b0e-9b0a-9e0a9b0e9b0a
```

**Response:**

*   **Status:** `204 No Content`
*   **Body:** `null`

## License

This project is licensed under the MIT License.
