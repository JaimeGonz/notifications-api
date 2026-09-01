# Notifications API

REST API for managing user notifications with support for multiple delivery channels (Email, SMS, Push Notification).

Built with **NestJS**, **PostgreSQL**, and **Prisma ORM**. Implements the **Strategy pattern** to handle channel-specific logic in a scalable and maintainable way.

---

## Table of contents

- [Notifications API](#notifications-api)
  - [Table of contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Run with Docker](#run-with-docker)
    - [Prerequisites](#prerequisites-1)
    - [Setup](#setup)
    - [Run the app](#run-the-app)
    - [Run the tests](#run-the-tests)
  - [API Documentation](#api-documentation)
  - [Live Demo](#live-demo)
  - [API Endpoints](#api-endpoints)
    - [Auth](#auth)
    - [Notifications](#notifications)
    - [Notification channels](#notification-channels)
  - [Technical Decisions](#technical-decisions)
    - [Strategy Pattern for notification channels](#strategy-pattern-for-notification-channels)
    - [Repository Pattern](#repository-pattern)
    - [JWT Authentication](#jwt-authentication)
    - [Prisma ORM](#prisma-orm)
  - [Testing](#testing)
  - [Known Limitations](#known-limitations)
  - [Author](#author)

---

## Tech Stack

- **NestJS** — Node.js framework
- **PostgreSQL** — Relational database
- **Prisma** — ORM and migrations
- **JWT** — Authentication
- **Bcrypt** — Password hashing
- **Swagger** — API documentation
- **Jest** — Unit testing

---

## Architecture

The project follows **Clean Architecture** principles, separating responsibilities into distinct layers:

**Controller**  →  handles HTTP requests and responses
**Service**     →  business logic
**Repository**  →  data access layer (abstracts Prisma)

The notification delivery system uses the **Strategy pattern** to handle different channels:

- Each channel (`email`, `sms`, `push`) is an independent class implementing a common `NotificationChannel` interface.
- A `NotificationChannelFactory` selects the correct strategy based on the channel type.
- Adding a new channel only requires creating a new class and registering it in the factory — no existing code is modified (**Open/Closed Principle**).
```
src/
├── auth/                                    # JWT authentication
│   ├── dto/
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   └── get-user.decorator.ts
├── notifications/                           # Notifications module
│   ├── channels/                            # Strategy pattern implementation
│   │   ├── channel.interface.ts
│   │   ├── email.channel.ts
│   │   ├── sms.channel.ts
│   │   └── push.channel.ts
│   ├── dto/
│   ├── notification-channel.factory.ts
│   ├── notifications.controller.ts
│   ├── notifications.repository.ts
│   └── notifications.service.ts
├── users/                                  # Users module
│   ├── users.repository.ts
│   └── users.service.ts
└── prisma/                                 # Database connection
```
---

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL running locally

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JaimeGonz/notifications-api.git
cd notifications-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/notifications_db"
JWT_SECRET="your_jwt_secret"
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

---
## Run with Docker

### Prerequisites
- Docker and Docker Compose installed

### Setup

1. Copy the environment files:
```bash
cp .env.docker.example .env.docker
cp .env.docker.test.example .env.docker.test
```

2. Update the values in `.env.docker` and `.env.docker.test` with your credentials.

### Run the app
```bash
chmod 777 ./up_dev.sh
./up_dev.sh
```

The API will be available at `http://localhost:3000`.

### Run the tests
```bash
chmod 777 ./up_test.sh
./up_test.sh
```

Runs the unit test suite in an isolated Dockerized environment, with its own PostgreSQL test database (`docker-compose.test.yml`).

---

## API Documentation

Swagger UI is available at: http://localhost:3000/api

## Live Demo

API deployed at:

https://notifications-api-production-7bbf.up.railway.app/

Swagger UI:

https://notifications-api-production-7bbf.up.railway.app/api

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT token |

### Notifications

All endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notifications` | Create and send a notification |
| GET | `/notifications` | List all notifications for the authenticated user |
| PATCH | `/notifications/:id` | Update a notification |
| DELETE | `/notifications/:id` | Delete a notification |

### Notification channels

| Channel | Logic |
|---------|-------|
| `email` | Validates recipient format, generates template, logs send |
| `sms` | Limits content to 160 characters, logs number and date |
| `push` | Validates device token, formats payload, logs status |

---

## Technical Decisions

### Strategy Pattern for notification channels
The challenge required that adding a new channel should not require modifying existing logic. The Strategy pattern solves this by encapsulating each channel's logic in its own class behind a common interface. The factory acts as the single point of channel selection. This follows the **Open/Closed Principle** — open for extension, closed for modification.

### Repository Pattern
A repository layer was added to abstract data access from business logic. The service layer has no knowledge of Prisma or any ORM — it only interacts with the repository. This makes the codebase easier to test and allows swapping the ORM without touching business logic.

### JWT Authentication
Each user can only access their own notifications. The authenticated user's ID is extracted from the JWT payload and used to scope all database queries.

### Prisma ORM
Prisma was chosen for its type-safe queries and straightforward migration workflow, which reduces runtime errors and improves developer experience.

---

## Testing

Unit tests are written with **Jest**, using mocked dependencies so the business logic is tested in full isolation (no real database or network calls).

- **`notifications.service.spec.ts`** — covers all 5 service methods (`create`, `findAll`, `findOne`, `update`, `remove`), including the error case where a notification is not found (`NotFoundException`).
- **`notification-channel.factory.spec.ts`** — covers all 3 valid channel strategies (`email`, `sms`, `push`) plus the invalid-channel case (`BadRequestException`), validating the Strategy pattern resolves correctly.

Tests run in an isolated Dockerized environment against a dedicated test database — see [Run the tests](#run-the-tests).

---

## Known Limitations

- Notification sending is simulated with console logs. In a production system, real email/SMS/push providers would be integrated (e.g. SendGrid, Twilio, Firebase).
- If the channel send fails after the notification is saved to the database, the notification remains persisted. A retry mechanism or transactional approach would be needed in production.
- Unit tests cover the service and channel-selection logic; controller-level and full e2e coverage are still limited to the default health-check test.

---

## Author

Jaime González

- GitHub: https://github.com/JaimeGonz
- LinkedIn: https://linkedin.com/in/jaimegonz01
- Email: valdoc7@gmail.com
