# Launch Match

An end-to-end platform to discover, submit, and manage startup profiles. It includes a Node/Express backend with authentication and a modern React (Vite + Tailwind) frontend.

## Features
- Startup submission and discovery
- User authentication and protected routes
- Clean UI components (Shadcn/UI)
- API with controllers, routes, and models

## Tech Stack
- Backend: Node.js, Express, MongoDB (via Mongoose)
- Frontend: React, Vite, Tailwind CSS, TypeScript-ready UI components
- Tooling: ESLint, PostCSS, GitHub

## Repository Structure
```
.
├─ backend/                  # Express API
│  ├─ config/
│  ├─ controller/
│  ├─ middleware/
│  ├─ model/
│  ├─ routes/
│  └─ src/app.js
└─ cosmic-launch-main/       # Frontend app (Vite)
   ├─ public/
   └─ src/
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### 1) Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create an environment file `.env` (you can copy from `.envsample`) with values like:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/launch_match
   JWT_SECRET=supersecret
   PORT=5000
   ```
3. Seed optional data (if applicable):
   ```bash
   node seedData.js
   ```
4. Run the server:
   ```bash
   npm start
   # or for dev with nodemon if available
   npm run dev
   ```

### 2) Frontend Setup
1. Install dependencies:
   ```bash
   cd cosmic-launch-main
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Vite will print a local URL (typically `http://localhost:5173`). Make sure the backend `PORT` matches what the frontend expects in `src/services/api.js`.

## Key Scripts
- Backend (from `backend/`):
  - `npm start` – start the Express server
  - `npm run dev` – start with hot-reload (if configured)
- Frontend (from `cosmic-launch-main/`):
  - `npm run dev` – start Vite dev server
  - `npm run build` – production build
  - `npm run preview` – preview production build

## API Overview
- Auth: login/signup handled in `backend/controller/usercontroller.js` and routes in `backend/routes/userRoutes.js`
- Startups: CRUD in `backend/controller/startupController.js` via `backend/routes/startupRoutes.js`
- Feedback: handled in `backend/controller/feedbackController.js` via `backend/routes/feedbackRoutes.js`

Adjust base URLs in `frontend` at `src/services/api.js` to point to your backend host.

## Development Tips
- Keep secrets in `.env` (already `.gitignore`d)
- Use feature branches and pull requests
- Run linters/formatters before committing when available

## License
MIT — feel free to use and modify.

