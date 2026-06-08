# DPET - Department Project & Team Management Portal

DPET is a full-stack web application built to streamline the final-year project allocation process in colleges. It enables students to create teams, select projects, invite team members, and request mentors, while providing professors with tools to manage mentoring requests and assigned teams.

## Features

### Student Module
- Secure authentication using JWT and HTTP-only cookies
- Create and manage project teams
- Browse and select available projects
- Search and invite students to join teams
- View sent invitations
- Receive and manage notifications
- Send mentor requests to professors
- Track project and team status through a dashboard

### Professor Module
- Secure role-based authentication
- View mentoring requests from student teams
- Accept or reject mentor requests
- Manage assigned teams
- Access professor dashboard and statistics

### Security
- Role-based route protection
- Protected APIs using JWT authentication
- Session persistence across page refreshes
- Unauthorized access handling

## Tech Stack

### Frontend
- React.js
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- Sonner

### Backend
- Node.js
- Express.js
- PostgreSQL
- Drizzle ORM
- JWT Authentication

## Key Functionalities
- Team Formation System
- Project Selection Workflow
- Mentor Assignment Workflow
- Notification Management
- Role-Based Access Control
- Dashboard Analytics

## Future Improvements
- Real-time notifications using Socket.IO
- Email invitation system
- File submission and project tracking
- Admin panel for project allocation management
- Team chat and collaboration tools

## Purpose

This project was developed to digitize and automate the project allocation process in academic institutions, reducing manual effort while improving transparency and collaboration between students and faculty.
