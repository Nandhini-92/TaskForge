# TaskForge — AI-Powered Multi-Tenant SaaS Project Management Platform

TaskForge is a full-stack SaaS project management platform built with **Next.js, NestJS, PostgreSQL, Redis, Socket.IO, Docker, and CI/CD**.

It provides organization-based workspaces, role-based access control, project and task management, Kanban workflows, real-time notifications, email workflows, and an analytics dashboard.

Additionally, TaskForge includes an **AI-powered task planning feature** that helps users break down a task into suggested subtasks, estimate the effort required, and provide contextual reasoning.

---

## Why This Project Stands Out

- Multi-tenant SaaS architecture with organization-based workspaces
- Role-based access control for workspace members
- Project and task management
- Kanban-style task workflows
- Dashboard with task and project analytics
- Real-time notifications using Socket.IO
- Email notification workflows using Nodemailer
- JWT-based authentication with refresh token support
- PostgreSQL and Redis backend architecture
- Background job processing using BullMQ
- Docker-based local and production setup
- CI/CD configuration with GitHub Actions
- **AI-powered task planning with suggested subtasks and effort estimation**

---

# AI-Powered Task Suggestions

TaskForge includes an AI-assisted feature designed to make task planning easier.

While creating a task, the user can use **Generate with AI** to receive intelligent suggestions based on the task title.

The AI can provide:

- Suggested subtasks
- Estimated effort
- Contextual reasoning

For example, for the task:

```text
Build authentication system
```

The AI can generate suggestions such as:

- Design authentication schema
- Implement email/password login
- Add OAuth integration
- Create password reset flow
- Write unit tests

It can also provide:

```text
Estimated effort: Medium
```

along with reasoning based on the complexity of the requested task.

This feature helps users convert a high-level task into smaller, actionable steps before adding it to their project workflow.

---

# Core Features

## Authentication

TaskForge supports authentication features including:

- User registration
- User login
- Protected routes
- JWT authentication
- Refresh token handling
- Password hashing using argon2
- Password reset workflow

---

## Organizations and Multi-Tenancy

Users can work inside organization-based workspaces.

Features include:

- Creating organizations
- Switching between organizations
- Organization-based data isolation
- Managing organization members
- Sending invitations
- Role-based permissions

Each workspace maintains its own projects, tasks, members, and activity.

---

## Project Management

Users can:

- Create projects
- View workspace projects
- Access project details
- Manage tasks within projects
- Track project progress

Projects act as containers for organizing related tasks and workflows.

---

## Task Management

Each task can contain:

- Title
- Description
- Status
- Priority
- Assignee
- Due date

Tasks can move through different workflow states such as:

- To Do
- In Progress
- Done

Task management is designed to support project planning and progress tracking.

---

## AI-Assisted Task Creation

During task creation, users can generate AI suggestions to help plan the task.

The AI-generated information includes:

### Suggested Subtasks

The task can be broken into smaller implementation steps.

### Estimated Effort

The AI provides an estimated effort level based on the task.

### AI Reasoning

The AI explains the reasoning behind the suggested breakdown and effort estimate.

This helps users quickly plan complex tasks without manually thinking through every implementation step.

---

## Dashboard and Analytics

The dashboard provides an overview of workspace activity.

It includes:

- Total projects
- Total tasks
- Tasks currently in progress
- Task completion percentage
- Task flow over time
- Task status distribution

The dashboard helps users quickly understand the current state of their workspace.

---

## Kanban Workflow

Tasks can be organized according to their status.

The workflow supports task movement between columns such as:

```text
To Do → In Progress → Done
```

This provides a visual way to track project progress.

---

## Real-Time Notifications

TaskForge includes a notification system for important workspace activity.

Notifications can be generated for events such as:

- Task assignments
- Task updates
- Member activity
- Organization events

The application uses **Socket.IO** for real-time communication.

---

## Email Workflows

The backend includes email functionality using Nodemailer.

Email workflows can support:

- Organization invitations
- Task assignment notifications
- Other application events

SMTP configuration can be provided through environment variables.

---

## Role-Based Access Control

TaskForge supports role-based permissions inside organizations.

Access control ensures that users can perform actions according to their assigned role.

The application uses authentication and authorization guards to protect sensitive operations.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Client State | Zustand |
| Server State | TanStack React Query |
| Drag and Drop | dnd-kit |
| Backend | NestJS 11 |
| Database | PostgreSQL 16 |
| ORM | TypeORM |
| Cache | Redis 7 |
| Redis Client | ioredis |
| Background Jobs | BullMQ |
| Real-Time Communication | Socket.IO |
| Authentication | JWT + Passport |
| Password Hashing | argon2 |
| Email | Nodemailer |
| Logging | Pino |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| AI Feature | AI-powered task suggestion and planning |

---

# Project Structure

```text
TaskForge/
│
├── .github/
│   └── workflows/                    # CI/CD workflows
│
├── frontend/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                      # Application pages
│   │   │   ├── auth/                 # Authentication pages
│   │   │   └── dashboard/            # Dashboard pages
│   │   │
│   │   ├── components/               # Reusable UI components
│   │   ├── features/                 # Feature modules
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   └── organizations/
│   │   │
│   │   ├── hooks/                    # Shared hooks
│   │   ├── lib/                      # Utilities and API configuration
│   │   ├── store/                    # Zustand stores
│   │   └── types/                    # TypeScript interfaces
│   │
│   ├── package.json
│   └── next.config.ts
│
├── backend/                          # NestJS backend
│   └── src/
│       ├── modules/
│       │   ├── auth/                 # Authentication
│       │   ├── users/                # User management
│       │   ├── organizations/        # Organizations and memberships
│       │   ├── projects/             # Project management
│       │   ├── tasks/                # Task management
│       │   ├── activity/             # Activity logging
│       │   ├── realtime/             # WebSocket functionality
│       │   ├── notifications/        # Notification system
│       │   ├── mail/                 # Email service
│       │   ├── billing/              # Billing architecture
│       │   └── health/               # Health checks
│       │
│       ├── infrastructure/           # Database, Redis and queues
│       ├── common/                   # Guards, decorators and filters
│       └── shared/                   # Shared enums and interfaces
│
├── nginx/                            # Nginx configuration
│
├── scripts/                          # Utility and deployment scripts
│
├── docker-compose.yml                # Development Docker setup
├── docker-compose.prod.yml           # Production Docker setup
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

---

# Getting Started

## Prerequisites

Before running the project locally, install:

- Node.js 20+
- PostgreSQL 16+
- Redis 7+

Docker can also be used for the containerized setup.

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Update the environment variables with your local configuration.

Run database migrations:

```bash
npm run migration:run
```

Start the backend development server:

```bash
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

For background jobs, run the worker separately if required:

```bash
npm run start:worker:dev
```

---

# Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.local.example .env.local
```

Start the development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3001
```

---

# Running the Application

After starting both the backend and frontend:

1. Open:

```text
http://localhost:3001
```

2. Register a new account.

3. Create or access an organization.

4. Create a project.

5. Create tasks inside the project.

6. Use **Generate with AI** when creating a task to receive suggested subtasks and effort estimation.

---

# Docker Setup

TaskForge includes Docker Compose configuration for running the application.

To build and start the containers:

```bash
docker-compose up --build
```

To run the containers in detached mode:

```bash
docker-compose up -d --build
```

To stop the containers:

```bash
docker-compose down
```

The project also includes:

```text
docker-compose.prod.yml
```

for production-oriented configuration.

---

# Environment Variables

## Backend `.env`

Example configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=taskforge

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Authentication
JWT_SECRET=your-secret-key-at-least-32-characters-long
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d

# Email
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=TaskForge <noreply@taskforge.io>

# Billing
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Frontend
FRONTEND_URL=http://localhost:3001
```

---

## Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

# API Overview

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh authentication tokens |
| GET | `/api/v1/auth/me` | Get current user |
| POST | `/api/v1/auth/logout` | Logout |

---

## Organizations

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/organizations` | Create an organization |
| GET | `/api/v1/organizations` | Get user organizations |
| POST | `/api/v1/organizations/switch` | Switch active organization |
| GET | `/api/v1/organizations/current` | Get current organization |
| GET | `/api/v1/organizations/members` | Get organization members |
| POST | `/api/v1/organizations/invites` | Send organization invitation |

---

## Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/projects` | Create a project |
| GET | `/api/v1/projects` | Get projects |
| GET | `/api/v1/projects/{id}` | Get project details |
| PATCH | `/api/v1/projects/{id}` | Update project |

---

## Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/projects/{id}/tasks` | Create a task |
| GET | `/api/v1/tasks` | Get tasks |
| PATCH | `/api/v1/tasks/{id}` | Update a task |

Task creation supports information such as:

- Title
- Description
- Status
- Priority
- Assignee
- Due date

The AI-powered task planning feature can assist the user during task creation.

---

## Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/notifications` | Get notifications |
| GET | `/api/v1/notifications/unread-count` | Get unread notification count |
| POST | `/api/v1/notifications/{id}/read` | Mark a notification as read |
| POST | `/api/v1/notifications/read-all` | Mark all notifications as read |

---

# Real-Time Architecture

TaskForge uses Socket.IO for real-time communication.

A typical flow is:

```text
Client
   │
   ▼
Next.js Frontend
   │
   ▼
NestJS API
   │
   ├───────────────┐
   ▼               ▼
PostgreSQL       Redis
   │
   ▼
Domain Events
   │
   ├───────────────┬────────────────┐
   ▼               ▼                ▼
BullMQ         Socket.IO       Notifications
Queue          Broadcast
   │
   ▼
Worker
```

Real-time communication can support:

- Task events
- Organization events
- Notifications
- Member activity

---

# Authentication and Authorization Flow

A typical request flow follows this structure:

```text
Client
   │
   ▼
Next.js Application
   │
   ▼
NestJS API
   │
   ▼
Authentication Guard
   │
   ▼
Organization Membership Check
   │
   ▼
Role-Based Authorization
   │
   ▼
Service Layer
   │
   ├──────────► PostgreSQL
   │
   └──────────► Redis
```

This structure helps protect organization resources and ensures users can only access authorized data.

---

# Multi-Tenant Architecture

TaskForge is designed around organization-based workspaces.

Each organization can maintain its own:

- Members
- Projects
- Tasks
- Notifications
- Activity

The application validates organization context and membership before allowing access to organization-specific functionality.

---

# Event-Driven Architecture

Application events can trigger multiple actions.

For example:

```text
Task Created
     │
     ▼
Domain Event
     │
 ┌───┼───────────────┐
 ▼   ▼               ▼
Activity      Notification      Real-Time
Logging       Creation          Broadcast
```

Background processing can be handled using BullMQ workers.

---

# AI Task Planning Workflow

The AI-assisted task feature follows a workflow similar to:

```text
User enters task title
        │
        ▼
Click "Generate with AI"
        │
        ▼
AI processes task context
        │
        ├──────────────► Suggested Subtasks
        │
        ├──────────────► Estimated Effort
        │
        └──────────────► AI Reasoning
        │
        ▼
User continues creating the task
```

The feature is intended to help users transform broad tasks into smaller, more manageable pieces of work.

---

# Use TaskForge as a Reference For

This project demonstrates concepts related to:

- Full-stack web development
- Next.js application architecture
- NestJS backend architecture
- Multi-tenant SaaS applications
- Organization-based access control
- JWT authentication
- Role-based authorization
- Project management systems
- Task management workflows
- Kanban-style interfaces
- Real-time applications with Socket.IO
- Redis caching
- PostgreSQL with TypeORM
- Background jobs with BullMQ
- Docker containerization
- CI/CD workflows
- AI-assisted task planning

---

# Future Improvements

Potential improvements include:

- Production deployment
- More advanced AI task recommendations
- AI-generated task descriptions
- AI-based project planning
- Improved analytics
- Advanced reporting
- Additional collaboration features
- Expanded automated testing
- Enhanced mobile responsiveness

---

# Contributing

Contributions are welcome.

Please review the project's:

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`

before submitting changes.

---

# License

This project is licensed under the MIT License.
