# Issue Tracker React App (Full Stack)

A full-stack issue tracking system inspired by Jira/GitHub Issues, built with React, TypeScript, Node.js, and PostgreSQL.

---

## Features

- Authentication (JWT-based)
- Role-based access control (Admin/User)
- Create, update, delete issues
- Assign issues to users
- Status workflow enforcement (OPEN → IN_PROGRESS → DONE)
- Comment system with permissions
- Pagination & filtering
- Optimistic UI updates
- Clean UI (card-based layout)

---

## Tech Stack

### Frontend
- React + TypeScript
- React Router
- Context API (Auth)
- Custom API layer

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Zod validation

---

## Key Concepts Implemented

- Strongly typed API layer (TypeScript generics)
- Discriminated unions for async state handling
- Role-based UI rendering
- RESTful API design
- SQL joins for relational data
- Clean architecture (controller/service separation)

---

## Setup

### Backend

```bash
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev