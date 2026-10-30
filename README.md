# Patients Management System

A full-stack patient management application built as a technical assessment. The project demonstrates a structured frontend/backend architecture, authentication, role-based authorization, patient CRUD operations, server-side search, sorting, pagination, validation, and a responsive user interface.

## What was cut

I kept this pass to a working patients flow. The items below were considered and left out because of time.

- **Optimistic updates.** Create and edit refetch the list after a successful save. A failed save does not roll a row back, because the row is not updated in place.
- **Theme switcher.** Dark color tokens are already in the stylesheet. I did not add a control to switch themes.
- **Testing.** The only automated test is the Nest starter spec. I did not add coverage for auth, patients, or the UI.
- **Simulated latency and forced failures.** Requests succeed or fail as the API responds. I did not add an artificial delay or a way to force an error.
- **Server-side rendering.** I considered rendering the patients list on the server, and decided not to because of time. The list loads in the browser after sign-in.
- **API response shape.** Login returns `accessToken`. The list nests page information under `pagination`. Updates use `PATCH`. Delete returns `{ message }`.
- **Details for admins.** Admins open a patient through the edit form. The read-only view is for the normal user role.
- **Token storage.** I am aware that storing the access token in localStorage is not the safest option. I could use cookies, but that setup was going to take more time, and that is why it was not proposed.

## Tech Stack

### Frontend
- **Next.js** — App Router
- **React** and **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** — UI components
- **TanStack Table** — Data table functionality
- **React Hook Form** — Form state management
- **Zod** — Client-side validation

### Backend
- **NestJS** — REST API
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** — Authentication
- **bcrypt** — Password hashing
- **class-validator / class-transformer** — Request validation

### Development
- npm workspaces
- Docker Compose
- ESLint
- Git

## Project Structure

This repository uses an npm workspaces monorepo.

```text
realhires-codingchallenge/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js routes and pages
│   │   ├── components/          # Reusable UI components
│   │   │   ├── patients/        # Patient-related components
│   │   │   ├── providers/       # React context providers
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # API client, types and utilities
│   └── .env.local
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── auth/                # Authentication and authorization
│       ├── patients/            # Patient management
│       ├── prisma/              # Prisma service and module
│       └── main.ts
│
├── docker-compose.yml
├── package.json
├── AGENTS.md
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- Node.js 22 or later
- npm
- Docker Desktop or Docker Engine
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd realhires-codingchallenge
```

### 2. Install dependencies

Install all workspace dependencies from the repository root:

```bash
npm install
```

### 3. Configure environment variables

Create `backend/.env`:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://patients_user:dev_password@localhost:5432/patients_db"

JWT_SECRET="replace-this-with-a-long-random-development-secret"
JWT_EXPIRES_IN="15m"
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Do not commit real secrets or production credentials.

### 4. Start PostgreSQL

Start the database using Docker Compose:

```bash
docker compose up -d
```

The development database is configured with:

| Setting | Value |
|---|---|
| Database | `patients_db` |
| Username | `patients_user` |
| Password | `dev_password` |
| Host | `localhost` |
| Port | `5432` |

### 5. Run database migrations

From the repository root:

```bash
npx prisma migrate dev --schema=backend/prisma/schema.prisma
```

Generate the Prisma client:

```bash
npx prisma generate --schema=backend/prisma/schema.prisma
```

### 6. Seed the database

Run the configured Prisma seed script:

```bash
npx prisma db seed --schema=backend/prisma/schema.prisma
```

The development seed includes the following accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `Admin123!` |
| User | `user@example.com` | `User123!` |

These are development-only credentials. Never use them in production.

### 7. Start the application

From the repository root:

```bash
npm run dev
```

The application should be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Available Scripts

Run scripts from the repository root.

| Command | Description |
|---|---|
| `npm run dev` | Starts frontend and backend concurrently |
| `npm run build` | Builds backend and frontend |
| `npm run lint` | Runs configured linting scripts, if available |

For workspace-specific scripts:

```bash
npm run dev -w frontend
npm run start:dev -w backend
```

Check each workspace's `package.json` for the complete list of available scripts.

## Authentication and Authorization

The application uses JWT-based authentication.

1. A user submits their email and password.
2. The backend verifies the credentials.
3. Passwords are checked using bcrypt.
4. The API returns an access token and user information.
5. Protected frontend requests include the token in the Authorization header.
6. The backend validates the token through its authentication guard.

### User Roles

| Permission | ADMIN | USER |
|---|:---:|:---:|
| Log in | Yes | Yes |
| View patients | Yes | Yes |
| Search patients | Yes | Yes |
| Sort patients | Yes | Yes |
| Paginate patients | Yes | Yes |
| Create patients | Yes | No |
| Update patients | Yes | No |
| Delete patients | Yes | No |

Authorization is enforced by the backend. Hiding frontend controls is only a UI convenience and must not be treated as a security boundary.

## API Overview

Base URL:

```text
http://localhost:3001
```

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/login` | Authenticate a user | Public |
| GET | `/auth/me` | Get current authenticated user | Authenticated |

Example login request:

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

### Patients

All patient endpoints require a valid JWT.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/patients` | List patients | ADMIN / USER |
| GET | `/patients/:id` | Get patient details | ADMIN / USER |
| POST | `/patients` | Create a patient | ADMIN |
| PATCH | `/patients/:id` | Update a patient | ADMIN |
| DELETE | `/patients/:id` | Delete a patient | ADMIN |

### Patient List Query Parameters

The list endpoint supports server-side pagination, search, and sorting.

| Parameter | Description | Example |
|---|---|---|
| `page` | Current page | `1` |
| `limit` | Number of records per page | `10` |
| `search` | Search term | `john` |
| `sortBy` | Field used for sorting | `lastName` |
| `order` | Sort direction | `asc` |

Example:

```text
GET /patients?page=1&limit=10&search=john&sortBy=lastName&order=asc
```

## Data Model

### User

- `id`
- `email` — unique
- `passwordHash`
- `role` — ADMIN or USER
- `createdAt`
- `updatedAt`

### Patient

- `id`
- `firstName`
- `lastName`
- `email` — unique
- `phoneNumber`
- `dob`
- `createdAt`
- `updatedAt`

Patient dates of birth are stored as PostgreSQL `DATE` values rather than timestamps.

## Architecture Decisions

### Frontend and backend separation

The frontend communicates with the backend exclusively through HTTP APIs. It does not access the database directly.

### Server-side data operations

Search, sorting, and pagination are handled by the backend. This avoids loading the entire patient dataset into the browser and provides consistent results as the dataset grows.

### Validation on both sides

The frontend validates form input to provide immediate feedback. The backend independently validates incoming requests because client-side validation cannot be trusted as a security boundary.

### Role-based authorization

The backend uses authentication and role guards to protect operations based on the user's role.

### Database access

Prisma provides typed database access and schema migrations.

## Security Considerations

- Passwords are hashed using bcrypt.
- Protected endpoints require JWT authentication.
- Administrative operations require the ADMIN role.
- Backend DTOs validate incoming data.
- Environment variables are used for secrets and configuration.
- The frontend stores the access token in localStorage for this assessment. Cookies would be safer, and that tradeoff is explained under What was cut.

## Development Notes

- Keep frontend UI components separate from API and data-fetching logic.
- Keep business logic in backend services rather than controllers.
- Use DTOs for request validation.
- Keep Prisma schema changes accompanied by migrations.
- Avoid committing `.env` files, credentials, build output, or `node_modules`.
- Prefer small, focused changes over unnecessary abstractions.

## License

This project was created for a technical assessment. Unless otherwise specified, it is not intended for redistribution or production use.