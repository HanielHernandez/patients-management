# AGENTS.md

## Project Context

This repository contains a full-stack Patients Management System built as a technical assessment.

The application is a monorepo with two independent applications:

- `frontend/`: Next.js App Router application using React and TypeScript.
- `backend/`: NestJS REST API using TypeScript, Prisma, and PostgreSQL.

The frontend communicates with the backend through HTTP requests. The backend owns business logic, authentication, authorization, validation, and database access.

Before making changes, inspect the existing implementation. Do not assume that a feature is missing just because it is not mentioned in this document.

## Primary Objectives

The project should demonstrate:

1. Clean separation of frontend and backend responsibilities.
2. Maintainable and understandable TypeScript code.
3. Secure authentication and role-based authorization.
4. Patient CRUD operations.
5. Server-side search, sorting, and pagination.
6. Consistent validation and error handling.
7. A responsive and accessible user interface.
8. Appropriate loading, empty, and error states.
9. Reliable handling of asynchronous operations.
10. Meaningful tests for important functionality.

Prioritize correctness, clarity, and completeness over unnecessary complexity.

---

# 1. General Development Rules

- Use TypeScript throughout the application.
- Prefer explicit types over `any`.
- Follow the conventions already established in the relevant workspace.
- Reuse existing utilities, components, hooks, and services before creating new ones.
- Keep changes focused on the requested task.
- Avoid unnecessary dependencies.
- Do not introduce abstractions that make straightforward functionality harder to understand.
- Do not duplicate business logic across components or services.
- Handle expected errors explicitly.
- Do not silently swallow errors.
- Do not expose passwords, password hashes, JWT secrets, or other sensitive information.
- Never trust frontend authorization or validation as a security boundary.
- Do not modify generated files manually.
- Do not modify package versions without a reason.
- Do not remove existing functionality to make an implementation simpler.

When working on a task:

1. Inspect the relevant files.
2. Understand the existing implementation and its dependencies.
3. Identify the smallest reasonable change.
4. Implement the change.
5. Run relevant linting, type checks, tests, or builds.
6. Report what changed and any remaining limitations.

Do not claim a command or test passed unless it was actually executed successfully.

# 2. Monorepo Structure

```text
/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── patients/
│   │   │   ├── providers/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── patients/
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
├── docker-compose.yml
├── package.json
├── README.md
└── AGENTS.md
```

The root package uses npm workspaces. Run workspace commands from the repository root unless a task requires otherwise.

# 3. Frontend Guidelines

## Technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Table, where used for data table behavior
- React Hook Form
- Zod

## Component Responsibilities

Follow these boundaries:

### `app/`

Responsible for:

- Route definitions.
- Page composition.
- Route-level loading and error states.
- Connecting page-level components and hooks.

Pages should not contain large amounts of unrelated data-fetching, form, and table implementation logic.

### `components/`

Responsible for reusable UI and presentation.

- `components/ui/`: shadcn/ui components.
- `components/patients/`: patient-specific components.
- `components/providers/`: application-level React providers.

Prefer presentational components that receive data and callbacks through props.

Avoid placing API requests directly inside reusable table or form components.

### `hooks/`

Responsible for reusable client-side state and behavior.

Examples:

- Patient fetching and mutations.
- Pagination state.
- Search and sorting state.
- Reusable asynchronous behavior.

Hooks should not become large collections of unrelated responsibilities.

### `lib/`

Responsible for:

- API client.
- API endpoint functions.
- Shared TypeScript types.
- Validation schemas.
- General utilities.

Keep API request implementation separate from UI components.

## Server and Client Components

- Prefer Server Components by default.
- Use `'use client'` only when client-side interaction or state is required.
- Keep client component boundaries as small as practical.
- Do not add `'use client'` to entire route trees unnecessarily.

## API Communication

Use the existing API client in `frontend/src/lib/api.ts`.

Use patient-specific API functions in `frontend/src/lib/patients.ts`.

Do not construct fetch requests independently in multiple components when an existing API function can be reused.

Authenticated requests must include the access token using the Authorization header:

```http
Authorization: Bearer <accessToken>
```

Use the configured API URL from:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Do not hardcode the API base URL in application components.

## Authentication

Authentication state is managed by the existing AuthProvider.

Use the `useAuth()` hook to access:

- Current user.
- Access token.
- Authentication loading state.
- Login functionality.
- Logout functionality.

Do not create a second independent authentication state system.

The current assessment implementation stores the access token in localStorage. Preserve the existing approach unless a task explicitly requests an authentication architecture change.

Never store user passwords in browser storage.

## Patient Data Management

The patient data layer should remain separate from presentation.

Expected responsibilities:

- Fetch patient records.
- Create patients.
- Update patients.
- Delete patients.
- Maintain search, sorting, and pagination state.
- Expose loading and error states.

The backend is responsible for filtering, sorting, and pagination.

Do not fetch all patients and perform these operations only in the browser.

### Data Table

When using TanStack Table:

- Use column definitions rather than hardcoding column rendering in the page.
- Use shadcn/ui Table components for presentation.
- Keep sorting and pagination state controlled.
- Use server-side sorting and pagination.
- Configure manual sorting and manual pagination.
- Translate table state into the backend query parameters.
- Do not apply local sorting to a dataset that has already been paginated by the backend.
- Keep action menus and dialogs separate from the underlying table implementation where practical.

The API currently supports a single sorting field. Do not expose multi-column sorting unless the backend is updated to support it.

## Forms and Validation

Use React Hook Form and Zod for forms.

- Keep validation schemas in `frontend/src/lib/validations/`.
- Reuse schemas when appropriate.
- Display field-level validation errors.
- Display meaningful server errors.
- Disable submission while a request is in progress.
- Prevent accidental duplicate submissions.
- Use appropriate input types and labels.
- Keep form components focused on a single responsibility.

Client-side validation improves UX but does not replace backend validation.

## UI and Accessibility

Use existing shadcn/ui components before creating custom equivalents.

Maintain:

- Consistent spacing and typography.
- Responsive layouts.
- Clear visual hierarchy.
- Accessible labels and controls.
- Keyboard-accessible dialogs and menus.
- Visible focus states.
- Loading, empty, success, and error feedback.

Avoid:

- Unnecessary animations.
- Excessive nested components.
- Large components with unrelated responsibilities.
- Browser alerts for normal application feedback when a toast or dialog is more appropriate.

---

# 4. Backend Guidelines

## Technology

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- class-validator
- class-transformer

## NestJS Architecture

Follow the standard NestJS module/controller/service structure.

### Controllers

Controllers should:

- Define HTTP endpoints.
- Apply guards and authorization decorators.
- Receive validated DTOs.
- Delegate business logic to services.
- Return appropriate responses.

Controllers should not contain database queries or complex business logic.

### Services

Services should:

- Contain business logic.
- Interact with Prisma.
- Handle database-related operations.
- Enforce relevant business rules.
- Return appropriate domain data.

### DTOs

Use DTOs for incoming request validation.

Use class-validator decorators and the existing global ValidationPipe.

Do not rely on TypeScript types alone for runtime validation.

### Modules

Keep related functionality grouped into NestJS modules.

Reuse existing shared modules rather than duplicating providers.

## Authentication and Authorization

Authentication is implemented using JWT.

- Passwords must be hashed with bcrypt.
- Never return password hashes in API responses.
- Protected endpoints must use the existing JWT authentication guard.
- Administrative endpoints must use the existing roles guard and role decorator.
- Authorization must be enforced by the backend.

Current roles:

```ts
type Role = 'ADMIN' | 'USER';
```

Expected access rules:

| Operation | ADMIN | USER |
|---|---|---|
| List patients | Allowed | Allowed |
| Get patient | Allowed | Allowed |
| Create patient | Allowed | Denied |
| Update patient | Allowed | Denied |
| Delete patient | Allowed | Denied |

Do not weaken these permissions without an explicit requirement.

## Patients Module

The Patients module owns patient-related business logic.

Current patient fields:

- `id`
- `firstName`
- `lastName`
- `email`
- `phoneNumber`
- `dob`
- `createdAt`
- `updatedAt`

Patient email addresses are unique.

The API supports:

- Listing patients.
- Retrieving a patient by ID.
- Creating patients.
- Updating patients.
- Deleting patients.
- Search.
- Sorting.
- Pagination.

### Query Parameters

The list endpoint supports:

```text
page
limit
search
sortBy
order
```

Keep query validation in the query DTO.

Never interpolate untrusted user input into raw SQL.

Use Prisma's structured query API wherever possible.

## Database and Prisma

The database is PostgreSQL.

Prisma schema location:

```text
backend/prisma/schema.prisma
```

Important rules:

- Make schema changes in `schema.prisma`.
- Create migrations for schema changes.
- Do not edit existing migration history casually.
- Use Prisma Client for database access.
- Keep database access inside backend services or dedicated data-access providers.
- Avoid exposing internal database fields in API responses.

After schema changes, regenerate Prisma Client and apply the appropriate migration.

Example:

```bash
npx prisma migrate dev --schema=backend/prisma/schema.prisma
npx prisma generate --schema=backend/prisma/schema.prisma
```

Do not reset the database or delete migration history unless explicitly requested.

## API Validation and Error Handling

The application uses a global ValidationPipe with:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Preserve these protections.

Use appropriate HTTP status codes.

Examples:

- `400 Bad Request`: invalid request data.
- `401 Unauthorized`: missing or invalid authentication.
- `403 Forbidden`: insufficient permissions.
- `404 Not Found`: requested resource does not exist.
- `409 Conflict`: unique constraint or conflicting resource.
- `500 Internal Server Error`: unexpected server failure.

Do not expose stack traces, secrets, or database internals in production responses.

---

# 5. API Contract

Base URL:

```text
http://localhost:3001
```

## Authentication

```text
POST /auth/login
GET  /auth/me
```

Successful login returns:

```json
{
  "accessToken": "<jwt>",
  "user": {
    "id": "<user-id>",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

## Patients

```text
GET    /patients
GET    /patients/:id
POST   /patients
PATCH  /patients/:id
DELETE /patients/:id
```

All patient routes require authentication.

Write operations require the ADMIN role.

List responses use this general structure:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Preserve the API response contract when changing frontend or backend behavior. If the contract must change, update both sides.

---

# 6. Testing and Quality

When adding or modifying functionality:

- Add tests for important business logic.
- Test authentication and authorization boundaries.
- Test validation failures.
- Test patient CRUD behavior.
- Test search, sorting, and pagination.
- Test frontend loading, empty, and error states.
- Test mutation failure handling where applicable.

Do not add superficial tests that only verify implementation details.

Prefer tests that verify observable behavior.

Before completing a task, run the relevant checks.

Examples:

```bash
npm run build
npm run lint
```

Run workspace-specific checks if root scripts are unavailable or do not cover the modified workspace.

Do not report tests as passing if they were not executed.

---

# 7. Security Rules

- Never commit `.env` or `.env.local` files.
- Never expose JWT secrets.
- Never return password hashes.
- Never trust client-provided roles.
- Never rely on frontend-only authorization.
- Validate all incoming API data.
- Use parameterized/structured database operations.
- Avoid logging credentials or access tokens.
- Preserve unique constraints and database integrity.
- Do not introduce insecure authentication shortcuts.

The current localStorage token approach is an assessment simplification. Do not claim it is the recommended production approach.

---

# 8. Scope and Priorities

This is a time-constrained technical assessment.

Prioritize:

1. Correctness.
2. Security and authorization.
3. Clear architecture.
4. Complete required functionality.
5. Good user experience.
6. Meaningful tests.
7. Maintainability.

Avoid spending time on:

- Unrequested infrastructure.
- Microservices.
- Complex state management libraries.
- Unnecessary design patterns.
- Premature abstractions.
- Overly generic reusable components.
- Features unrelated to the assessment requirements.

Prefer a small, complete, well-implemented solution over a large, partially implemented one.

---

# 9. Instructions for AI Coding Agents

When asked to implement a task:

1. Read this file and the relevant README sections.
2. Inspect the actual source code before proposing changes.
3. Identify the frontend and backend responsibilities involved.
4. Check existing types, API contracts, DTOs, hooks, and components.
5. Avoid duplicating existing functionality.
6. Implement the smallest maintainable solution.
7. Update related tests when appropriate.
8. Run relevant validation commands.
9. Summarize changed files and implementation decisions.
10. Clearly disclose anything not implemented or not verified.

Do not:

- Rewrite working functionality without a clear reason.
- Change API contracts without updating both applications.
- Introduce dependencies without justification.
- Assume a feature exists based only on this document.
- Invent test results.
- Remove security protections.
- Make unrelated formatting or refactoring changes.

If a requirement is ambiguous, inspect the existing implementation first. If it remains ambiguous and materially affects the solution, explain the assumption before proceeding.

## Final Principle

Write code that another developer can understand, review, test, and maintain. Favor explicit, straightforward solutions over clever or unnecessarily abstract implementations.