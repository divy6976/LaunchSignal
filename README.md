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

---

## Project Interview Questions

### 1. Can you explain Project?

**Launch Match** is an end-to-end platform designed to connect startups with early adopters. The project serves as a discovery and submission platform where:

- **Founders** can submit their startup profiles, manage their listings, track analytics (views, upvotes, feedback), and engage with potential adopters
- **Adopters** can discover new startups, browse through various categories and industries, upvote their favorite startups, and provide feedback
- **Admins** can manage startup submissions (approve/reject), view platform-wide analytics, and oversee the entire ecosystem

The platform facilitates the early-stage startup ecosystem by providing a centralized hub for startup discovery, feedback collection, and community engagement. It includes features like startup analytics, upvoting system, feedback mechanisms, and role-based access control.

### 2. Can you explain project architecture?

The project follows a **full-stack architecture** with clear separation between frontend and backend:

#### **Backend Architecture (Node.js/Express)**
- **Framework**: Express.js 5.1.0 with RESTful API design
- **Database**: MongoDB with Mongoose ODM for data modeling
- **Authentication**: JWT (JSON Web Tokens) with cookie-based sessions
- **Structure**:
  - `config/` - Database configuration and connection
  - `model/` - Mongoose schemas (User, Startup, Feedback, Upvote)
  - `controller/` - Business logic handlers (userController, startupController, feedbackController, contactController)
  - `routes/` - API endpoint definitions (userRoutes, startupRoutes, feedbackRoutes, contactRoutes)
  - `middleware/` - Authentication and authorization middleware
  - `src/app.js` - Main Express application entry point

#### **Frontend Architecture (React/Vite)**
- **Framework**: React 18.3.1 with functional components and hooks
- **Build Tool**: Vite 5.4.19 for fast development and optimized builds
- **Styling**: Tailwind CSS with Shadcn/UI component library
- **State Management**: React Query (TanStack Query) for server state, React hooks for local state
- **Routing**: React Router DOM v6 with animated page transitions (Framer Motion)
- **Structure**:
  - `pages/` - Route-level components (Index, Login, Signup, StartupsFeed, FounderDashboard, AdminDashboard, etc.)
  - `components/` - Reusable UI components (Header, Footer, Analytics, Discovery, etc.)
  - `services/` - API service layer for backend communication
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions

#### **Communication Flow**
- Frontend makes HTTP requests to backend API endpoints
- Backend validates requests, processes business logic, and interacts with MongoDB
- Responses are sent back as JSON
- CORS is configured to allow cross-origin requests between frontend and backend

### 3. Can you explain Module in Project?

The project is organized into **functional modules** on both backend and frontend:

#### **Backend Modules:**

1. **User Module** (`usercontroller.js`, `userRoutes.js`, `usermodel.js`)
   - Handles user registration, login, authentication
   - Manages user profiles, roles (founder/adopter), and interests
   - JWT token generation and validation

2. **Startup Module** (`startupController.js`, `startupRoutes.js`, `startupmodel.js`)
   - Startup CRUD operations (create, read, update, delete)
   - Startup discovery and filtering (by category, industry, business type)
   - Analytics tracking (views, upvotes, feedback)
   - Status management (pending/approved/rejected)

3. **Feedback Module** (`feedbackController.js`, `feedbackRoutes.js`, `feedbackModel.js`)
   - Allows adopters to submit feedback on startups
   - Retrieves feedback for specific startups
   - Links feedback to both user and startup

4. **Upvote Module** (`upvoteModel.js`, integrated in `startupController.js`)
   - Tracks user upvotes for startups
   - Prevents duplicate upvotes (unique constraint)
   - Provides upvote counts and user upvote history

5. **Contact Module** (`contactController.js`, `contactRoutes.js`)
   - Handles contact form submissions
   - Email notifications (via Nodemailer)

6. **Authentication Middleware** (`middleware/auth.js`)
   - Protects routes requiring authentication
   - Validates JWT tokens
   - Role-based access control

#### **Frontend Modules:**

1. **Authentication Module** (`pages/Login.jsx`, `pages/Signup.jsx`)
   - User login and registration forms
   - Google OAuth integration
   - Session management via localStorage

2. **Startup Discovery Module** (`pages/StartupsFeed.jsx`, `components/StartupDiscovery.jsx`)
   - Displays all approved startups
   - Search and filter functionality
   - Upvote and view startup details

3. **Startup Management Module** (`pages/SubmitStartup.jsx`, `pages/FounderDashboard.jsx`)
   - Startup submission form
   - Founder's startup listing and management
   - Analytics dashboard for founders

4. **Analytics Module** (`components/StartupAnalytics.jsx`, `pages/StartupAnalyticsPage.jsx`)
   - View tracking and engagement metrics
   - Charts and visualizations (Recharts)
   - Daily/hourly view analytics

5. **Admin Module** (`pages/AdminDashboard.jsx`)
   - Admin dashboard for managing startups
   - Approve/reject startup submissions
   - Platform-wide statistics

6. **UI Components Module** (`components/ui/`)
   - Reusable Shadcn/UI components (buttons, cards, dialogs, forms, etc.)
   - Consistent design system

7. **API Service Module** (`services/api.js`)
   - Centralized API calls
   - Axios-based HTTP client
   - Error handling utilities

### 4. Can you explain user's in Project?

The project supports **two primary user roles** with distinct permissions and functionalities:

#### **1. Founder Role** (`role: 'founder'`)
Founders are startup creators who can:
- **Submit Startups**: Create and submit startup profiles with details like name, tagline, description, industry, categories, business type (B2B/B2C), target audience, website, logo, and media
- **Manage Startups**: Edit, update, and manage their submitted startups
- **View Analytics**: Access detailed analytics for their startups including:
  - Total views, upvotes, and feedback counts
  - Daily and hourly view patterns
  - Engagement rates and growth metrics
  - Demographic data and traffic sources
- **Dashboard Access**: Use the Founder Dashboard to see all their startups, statistics, and recent feedback
- **Special Offers**: Add special offers, discount codes, and promotional content for early adopters

#### **2. Adopter Role** (`role: 'adopter'`)
Adopters are users interested in discovering and engaging with startups:
- **Discover Startups**: Browse and search through approved startup listings
- **Filter & Search**: Filter startups by category, industry, business type (B2B/B2C)
- **Upvote Startups**: Show interest by upvoting favorite startups (one upvote per user per startup)
- **Provide Feedback**: Submit feedback comments (minimum 10 characters) on startups
- **View Details**: Access detailed startup information including descriptions, media, and special offers
- **Track Interests**: Maintain a list of upvoted startups for easy reference

#### **User Model Schema:**
```javascript
{
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (required, enum: ['founder', 'adopter']),
  interests: [String] (optional array),
  upvotedStartups: [ObjectId] (references to Startup model),
  timestamps: true (createdAt, updatedAt)
}
```

#### **Additional User Features:**
- **Password Security**: Passwords are hashed using bcrypt before storage
- **Session Management**: JWT-based authentication with cookie support
- **Google OAuth**: Optional Google authentication integration
- **Interest Tracking**: Users can maintain a list of interests
- **Upvote History**: Users can track which startups they've upvoted

### 5. How many database tables are present in your project?

The project uses **MongoDB** (a NoSQL database), which uses **collections** instead of traditional tables. There are **4 main collections/models** in the database:

#### **1. User Collection** (`usermodel.js`)
- **Purpose**: Stores user accounts and authentication data
- **Key Fields**: fullName, email, password (hashed), role (founder/adopter), interests, upvotedStartups
- **Relationships**: References Startup model via upvotedStartups array

#### **2. Startup Collection** (`startupmodel.js` - defined in `startupController.js`)
- **Purpose**: Stores startup profiles and information
- **Key Fields**: 
  - founderId (references User), name, tagline, description, industry, categories
  - businessType (B2B/B2C), targetAudience, website, logo, media
  - status (pending/approved/rejected), views, analytics data
  - specialOfferText, specialOfferCode, discount
- **Relationships**: 
  - References User model via founderId
  - Referenced by Feedback and Upvote models

#### **3. Feedback Collection** (`feedbackModel.js`)
- **Purpose**: Stores user feedback/comments on startups
- **Key Fields**: startupId (references Startup), userId (references User), comment
- **Relationships**: 
  - References Startup model via startupId
  - References User model via userId
- **Constraints**: Comment must be at least 10 characters long

#### **4. Upvote Collection** (`upvoteModel.js`)
- **Purpose**: Tracks which users have upvoted which startups
- **Key Fields**: startupId (references Startup), userId (references User)
- **Relationships**: 
  - References Startup model via startupId
  - References User model via userId
- **Constraints**: Unique compound index on (startupId, userId) to prevent duplicate upvotes

#### **Database Relationships Summary:**
- **User** → **Startup** (One-to-Many: one founder can have multiple startups)
- **User** → **Feedback** (One-to-Many: one user can give multiple feedback)
- **User** → **Upvote** (One-to-Many: one user can upvote multiple startups)
- **Startup** → **Feedback** (One-to-Many: one startup can have multiple feedback)
- **Startup** → **Upvote** (One-to-Many: one startup can be upvoted by multiple users)

All models include `timestamps: true`, which automatically adds `createdAt` and `updatedAt` fields to track document creation and modification times.

---

## License
MIT — feel free to use and modify.

