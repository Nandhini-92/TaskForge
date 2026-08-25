
# TaskForge - AI-Powered Multi-Tenant SaaS Project Management Platform

TaskForge is a full-stack SaaS project management platform designed to help teams organize projects, manage tasks, collaborate efficiently, and track work in real time.

Built using Next.js, NestJS, PostgreSQL, Redis, Socket.IO, Docker, and AI integration, TaskForge provides organization-based workspaces, role-based access control, project and task management, real-time notifications, analytics, and AI-assisted task creation.

## Features

### Authentication and Security

- User registration and login
- JWT-based authentication
- Access and refresh token support
- Password reset functionality
- Email verification
- Protected routes
- Role-based access control
- Request validation and centralized error handling
- Rate limiting

## Multi-Tenant Organizations

TaskForge supports multiple organizations and workspaces.

Users can:

- Create organizations
- Switch between organizations
- Invite members
- Accept organization invitations
- Manage organization members
- Work within isolated organization-based data

Each organization maintains its own projects, tasks, members, and activities.

## Project Management

Users can:

- Create projects
- Update project details
- View projects within an organization
- Organize tasks under specific projects
- Track project activity

Projects provide a structured way to manage related tasks and team workflows.

## Task Management

TaskForge provides a complete task management system.

Users can:

- Create tasks
- Update tasks
- Assign tasks to organization members
- Set priorities
- Set due dates
- Update task status
- Filter tasks
- Organize tasks by project
- View detailed task information

Supported task statuses include:

- To Do
- In Progress
- Completed

Tasks can also be managed using a Kanban-style workflow.

## AI-Powered Task Assistance

TaskForge includes an AI-assisted feature to make task creation faster and easier.

While creating a task, users can use Generate with AI to receive intelligent suggestions based on the task information provided.

The AI can automatically suggest:

- Task description
- Task priority
- Due date

Users can review the generated suggestions and use them while creating the task.

This helps reduce the effort required to manually fill in task details.

## Dashboard and Analytics

The dashboard provides an overview of the organization's workspace.

Users can view:

- Task statistics
- Task status distribution
- Priority distribution
- Recent activity
- Upcoming deadlines
- Workflow summaries
- Workspace health

The dashboard helps users quickly understand the current state of their projects and tasks.

## Real-Time Notifications

TaskForge supports real-time updates using Socket.IO.

Users can receive notifications for events such as:

- Task assignments
- Project activity
- Organization events
- Other workspace updates

The application also supports notification management through the dashboard.

## Activity Tracking

TaskForge records important actions performed within an organization.

Activity tracking helps users monitor events such as:

- Task creation
- Task updates
- Project changes
- Organization-related actions

This provides better visibility into team activity and workspace changes.

## Email Workflows

The backend supports email-based workflows including:

- Email verification
- Password reset
- Organization invitations
- Task assignment notifications

Email templates are handled through the backend mail module.

## Subscription and Billing Architecture

TaskForge includes a billing architecture designed to support subscription-based plans.

The system includes support for:

- Subscription plans
- Usage tracking
- Plan limits
- Stripe integration
- Checkout sessions
- Webhook handling

This architecture makes the application suitable for a SaaS-based subscription model.

## System Architecture

TaskForge follows a modern full-stack architecture.

```
                +---------------------+
                |      Next.js        |
                |      Frontend       |
                +----------+----------+
                           |
                           | REST API
                           |
                +----------v----------+
                |      NestJS         |
                |      Backend        |
                +-------+-------+-----+
                        |       |
             +----------v-+   +-v----------+
             | PostgreSQL |   |   Redis    |
             |  Database  |   | Cache/Queue|
             +------------+   +------------+
                        |
                 +------v------+
                 |  Socket.IO  |
                 |  Real-Time  |
                 +-------------+
````

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Query
* Zustand
* Socket.IO Client

### Backend

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* Redis
* JWT Authentication
* Socket.IO
* Stripe
* AI API Integration

### DevOps and Infrastructure

* Docker
* Docker Compose
* Nginx
* Vercel deployment configuration

## Project Structure


TaskForge
|
|-- frontend
|   |-- src
|   |   |-- app
|   |   |-- components
|   |   |-- features
|   |   |-- hooks
|   |   |-- lib
|   |   |-- store
|   |   `-- types
|
|-- backend
|   |-- src
|   |   |-- common
|   |   |-- config
|   |   |-- infrastructure
|   |   |-- modules
|   |   `-- shared
|
|-- nginx
|
|-- scripts
|
|-- docs
|
|-- docker-compose.yml
|
`-- docker-compose.prod.yml
```

## Running the Project Locally

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Docker
* Docker Compose

### Clone the Repository

```
git clone <your-repository-url>
cd TaskForge
```

### Configure Environment Variables

Create the required environment files based on the provided examples.

For the backend, configure variables such as:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

REDIS_HOST=
REDIS_PORT=

OPENAI_API_KEY=
GROQ_API_KEY=

SMTP_USER=
SMTP_PASS=
```

### Run Using Docker

From the project root:

```
docker compose up --build
```

This starts:

* PostgreSQL
* Redis
* Backend API
* Background worker
* Database migrations

The frontend can be started separately from the `frontend` directory.

## Key Backend Modules

The backend is organized into modular domains.

### Authentication

Handles:

* Registration
* Login
* JWT authentication
* Refresh tokens
* Password reset
* Email verification

### Organizations

Handles:

* Organization creation
* Member management
* Invitations
* Organization switching

### Projects

Handles project creation, updates, and organization-level project management.

### Tasks

Handles:

* Task creation
* Task updates
* Task filtering
* Task assignment
* Task priorities
* Task statuses
* Due dates

### AI

Provides AI-powered assistance for generating task details.

### Notifications

Handles application and real-time notifications.

### Activity

Tracks important actions and events across the workspace.

### Billing

Provides subscription, plan, usage, and Stripe integration architecture.

### Real-Time

Uses Socket.IO for real-time events and updates.

## Security Features

The application includes several security-focused practices:

* JWT authentication
* Access and refresh tokens
* Password hashing
* Protected API routes
* Role-based authorization
* Organization-level data isolation
* Environment-based secrets
* Request validation
* Rate limiting
* Centralized exception handling

## Docker Support

The project includes Docker configuration for containerized development and deployment.

Available services include:

* PostgreSQL
* Redis
* Backend API
* Background worker
* Database migrations
* Nginx for production deployment

Docker Compose simplifies running the complete backend infrastructure locally.

## Future Improvements

Possible future improvements include:

* Advanced AI task recommendations
* AI-generated project planning
* Team productivity analytics
* File attachments
* Calendar integration
* Advanced search
* Mobile application
* Additional third-party integrations

## Why This Project Stands Out

TaskForge demonstrates experience with:

* Full-stack application development
* Multi-tenant SaaS architecture
* Role-based access control
* REST API design
* Real-time communication
* Redis caching and queues
* PostgreSQL and TypeORM
* Dockerized infrastructure
* Authentication and security
* Email workflows
* Subscription architecture
* AI-powered task assistance

## Author

Nandhini Janjala

Built as a full-stack project to explore scalable SaaS architecture, real-time collaboration, and AI-assisted productivity workflows.
