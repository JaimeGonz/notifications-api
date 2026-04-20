# Notifications API

REST API for managing user notifications with support for multiple delivery channels (Email, SMS, Push Notification).

Built with **NestJS**, **PostgreSQL**, and **Prisma ORM**. Implements the **Strategy pattern** to handle channel-specific logic in a scalable and maintainable way.

---

## Tech Stack

- **NestJS** — Node.js framework
- **PostgreSQL** — Relational database
- **Prisma** — ORM and migrations
- **JWT** — Authentication
- **Bcrypt** — Password hashing
- **Swagger** — API documentation

---

## Architecture

The notification delivery system uses the **Strategy pattern** to handle different channels:

- Each channel (`email`, `sms`, `push`) is an independent class implementing a common `NotificationChannel` interface.
- A `NotificationChannelFactory` selects the correct strategy based on the channel type.
- Adding a new channel only requires creating a new class and registering it in the factory — no existing code is modified (**Open/Closed Principle**).
```
src/
├── auth/                  # JWT authentication
│   ├── dto/
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   └── get-user.decorator.ts
├── notifications/         # Notifications module
│   ├── channels/          # Strategy pattern implementation
│   │   ├── channel.interface.ts
│   │   ├── email.channel.ts
│   │   ├── sms.channel.ts
│   │   └── push.channel.ts
│   ├── dto/
│   ├── notification-channel.factory.ts
│   ├── notifications.controller.ts
│   └── notifications.service.ts
├── users/                 # Users module
└── prisma/                # Database connection
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

## Live Demo

API deployed at: 

https://notifications-api-production-7bbf.up.railway.app/

Swagger UI: 

https://notifications-api-production-7bbf.up.railway.app/api

## API Documentation

Swagger UI is available at: http://localhost:3000/api

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
The challenge required that adding a new channel should not require modifying existing logic. The Strategy pattern solves this by encapsulating each channel's logic in its own class behind a common interface. The factory acts as the single point of channel selection.

### JWT Authentication
Each user can only access their own notifications. The authenticated user's ID is extracted from the JWT payload and used to scope all database queries.

### Prisma ORM
Prisma was chosen for its type-safe queries and straightforward migration workflow, which reduces runtime errors and improves developer experience.