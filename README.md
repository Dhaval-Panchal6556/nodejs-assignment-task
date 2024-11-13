Project Management System

Getting Started

This project is a NestJS application that provides a comprehensive system for managing projects, tasks, and user collaboration. It features user authentication, CRUD operations for projects and tasks, and real-time collaboration using Socket.io.

Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (version 20.x or higher)
- MongoDB (for database management)

Installation

To get started with this project, follow these steps:

1. Install dependencies:

   npm install

2. Configure your environment variables:

   - Copy the contents of `.env.example` to a new file named `.env`.
   - Update your MongoDB URI and other environment variables.

Running the App

1. Start the development server:

   npm run start:dev

2. Access the app:

   The app will be available at http://localhost:3000/.

3. Access Swagger API Documentation:

   You can view the Swagger API documentation at http://localhost:3000/api-docs.

Features

- User Authentication: JWT-based login and registration.
- Project Management: Create, update, view, and delete projects.
- Task Management: Create, assign, and manage tasks within projects.
- Real-Time Collaboration: Task updates and discussions using WebSockets (Socket.io).
- Advanced Search & Filtering: Search, filter, and sort projects and tasks.

Release Notes

- Node.js version: 20.x
- NestJS version: Latest
- Last updated: 11-06-2024

This project provides a solid foundation for managing projects and tasks with real-time collaboration capabilities. Feel free to customize it further as per your needs!
