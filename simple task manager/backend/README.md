Personal Task and Notes Manager:

A full-stack web application to manage tasks and notes with user authentication. Built with Node.js, Express, SQLite, and vanilla JavaScript.

Features:

    User registration and login with JWT authentication
    CRUD operations for tasks and notes
    User-specific data: each user sees only their own tasks and notes
    Search and filter tasks
    Responsive, interactive frontend

Tech Stack:

    Backend: Node.js, Express, SQLite
    Authentication: JWT, bcrypt
    Frontend: HTML, CSS, JavaScript
    Environment Variables: dotenv

Installation:

Clone the repo:

git clone https://github.com/<your-username>/task-notes-manager.git
cd task-notes-manager/backend


Install dependencies:

npm install


Create .env file:

PORT=3000
JWT_SECRET=your_secret_key


Run the server:

node server.js


Open frontend: Open index.html in your browser or serve via Live Server.

API Endpoints:

Authentication:

Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login user & get JWT

Tasks (JWT required):

Method	Endpoint	Description
GET	/tasks	List user tasks
POST	/tasks	Create new task
PUT	/tasks/:id	Update task
DELETE	/tasks/:id	Delete task

Notes (JWT required):

Method	Endpoint	Description
GET	/notes	List user notes
POST	/notes	Create new note
PUT	/notes/:id	Update note
DELETE	/notes/:id	Delete note

JWT Header format:

Authorization: Bearer <token>

🎨 Frontend Usage

Register a new account or login with existing credentials.

Manage tasks: create, edit, delete, filter, and search.

Manage notes: create, edit, delete.

Logout clears your JWT token.