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
- **Repositories**: Provide an abstraction over data persistence, allowing the application layer to remain independent of the database technology.

## 🏗️ Design Patterns

- **Repository**: Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.
- **Factory**: Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.
- **Adapter**: Allows objects with incompatible interfaces to collaborate.
- **Strategy**: Lets you define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.

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

-   **Run integration tests:**
    ```bash
    pnpm test:int
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

##  Swagger Documentation

This project uses Swagger for interactive API documentation. Once the application is running, you can access the Swagger UI at:

[http://localhost:3000/docs](http://localhost:3000/docs)

## 📖 API Documentation

### Authentication

Most routes require authentication using an JWT Token.

### Session

#### `POST /auth`

Authenticates a user.

-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

-   **Success Response (200 OK):**
    ```json
    {
      "id": "c1b9a8f8-1b1a-4b1a-8b1a-1b1a1b1a1b1a",
      "name": "John Doe",
      "email": "user@example.com",
      ...
    }
    ```

### Users

#### `POST /users`

Creates a new user account.

-   **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "password": "password123"
    }
    ```

-   **Success Response (201 Created)**

#### `GET /users`

Fetches a paginated list of users.

-   **Query Parameters:** `page`, `pageSize`

-   **Success Response (200 OK):**
    ```json
    {
      "page": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1,
      "items": [
        {
          "id": "c1b9a8f8-1b1a-4b1a-8b1a-1b1a1b1a1b1a",
          "name": "John Doe",
          ...
        }
      ]
    }
    ```

#### `GET /users/:email`

Fetches a single user by email.

-   **Success Response (200 OK):**
    ```json
    {
      "id": "c1b9a8f8-1b1a-4b1a-8b1a-1b1a1b1a1b1a",
      "name": "John Doe",
      "email": "user@example.com",
      ...
    }
    ```

#### `DELETE /users/:userId`

Deletes a user account.

-   **Success Response (204 No Content)**

### Questions

#### `POST /questions`

Creates a new question.

-   **Request Body:**
    ```json
    {
      "title": "How to use Fastify?",
      "content": "I'm new to Fastify..."
    }
    ```

-   **Success Response (201 Created)**

#### `GET /questions`

Fetches a paginated list of questions.

-   **Query Parameters:** `page`, `pageSize`

-   **Success Response (200 OK):**
    ```json
    {
      "page": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1,
      "items": [
        {
          "id": "d2b9a8f8-2b2a-4b2a-8b2a-2b2a2b2a2b2a",
          "title": "How to use Fastify?",
          "slug": "how-to-use-fastify",
          "content": "I'm new to Fastify and I'd like to know the basics.",
          "bestAnswerId": null,
          "createdAt": "2025-08-12T11:00:00.000Z",
          "updatedAt": "2025-08-12T11:00:00.000Z"
        }
      ]
    }
    ```

#### `GET /questions/:slug`

Fetches a single question by its slug.

-   **Success Response (200 OK):**
    ```json
    {
      "id": "d2b9a8f8-2b2a-4b2a-8b2a-2b2a2b2a2b2a",
      "title": "How to use Fastify?",
      "slug": "how-to-use-fastify",
      "content": "I'm new to Fastify and I'd like to know the basics.",
      "bestAnswerId": null,
      "createdAt": "2025-08-12T11:00:00.000Z",
      "updatedAt": "2025-08-12T11:00:00.000Z"
    }
    ```

#### `DELETE /questions/:questionId`

Deletes a question. The user must be the author of the question.

-   **Success Response (204 No Content)**

### Answers

#### `POST /answers`

Adds an answer to a question.

-   **Request Body:**
    ```json
    {
      "questionId": "d2b9a8f8-2b2a-4b2a-8b2a-2b2a2b2a2b2a",
      "content": "You should check the official documentation."
    }
    ```

#### `GET /answers/:questionId/answers`

Fetches all answers for a specific question.

-   **Query Parameters:** `page`, `pageSize`

-   **Success Response (200 OK):**
    ```json
    {
      "page": 1,
      "pageSize": 10,
      "totalItems": 1,
      "totalPages": 1,
      "items": [
        {
          "id": "e3b9a8f8-3b3a-4b3a-8b3a-3b3a3b3a3b3a",
          "content": "You should check the official documentation.",
          "questionId": "d2b9a8f8-2b2a-4b2a-8b2a-2b2a2b2a2b2a",
          "createdAt": "2025-08-12T12:00:00.000Z",
          "updatedAt": "2025-08-12T12:00:00.000Z"
        }
      ]
    }
    ```

#### `PATCH /answers/:answerId/choose`

Marks an answer as the best answer for a question.

#### `DELETE /answers/:answerId`

Deletes an answer. The user must be the author of the answer.

-   **Success Response (204 No Content)**
