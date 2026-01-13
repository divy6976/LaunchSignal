# LaunchSignal - Interview Preparation Guide

## 🎯 Project Overview

**LaunchSignal** is a full-stack web platform that connects **startup founders** with **early adopters**. Think of it as a "Product Hunt" or "BetaList" style platform where:

- **Founders** can submit their startups, track analytics, and get feedback
- **Early Adopters** can discover new startups, upvote favorites, and provide feedback
- **Admins** can approve/reject startup submissions and manage the platform

---

## 🏗️ Architecture Overview

### **Tech Stack**

**Backend:**
- **Node.js** with **Express.js 5.1.0** (RESTful API)
- **MongoDB** with **Mongoose** (NoSQL database)
- **JWT** authentication with cookies
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications

**Frontend:**
- **React 18.3.1** (functional components + hooks)
- **Vite** (build tool)
- **Tailwind CSS** + **Shadcn/UI** (styling)
- **React Router DOM v6** (routing)
- **Framer Motion** (animations)
- **React Query (TanStack Query)** (server state management)
- **Axios** (HTTP client)
- **Recharts** (analytics charts)

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📁 Project Structure

```
LaunchSignal/
├── backend/                    # Express API Server
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controller/            # Business logic
│   │   ├── usercontroller.js  # Auth, user management
│   │   ├── startupController.js  # Startup CRUD, analytics
│   │   ├── feedbackController.js  # Feedback management
│   │   └── contactController.js   # Contact form
│   ├── middleware/
│   │   └── auth.js            # JWT verification, role checks
│   ├── model/                 # Mongoose schemas
│   │   ├── usermodel.js
│   │   ├── startupmodel.js
│   │   ├── feedbackModel.js
│   │   └── upvoteModel.js
│   ├── routes/                # API endpoints
│   │   ├── userRoutes.js
│   │   ├── startupRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── contactRoutes.js
│   └── src/
│       └── app.js             # Express app entry point
│
└── cosmic-launch-main/         # React Frontend
    ├── src/
    │   ├── pages/              # Route components
    │   │   ├── Index.jsx      # Landing page
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── StartupsFeed.jsx  # Adopter feed
    │   │   ├── FounderDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── SubmitStartup.jsx
    │   ├── components/         # Reusable components
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── StartupAnalytics.jsx
    │   │   └── ui/             # Shadcn components
    │   ├── services/
    │   │   └── api.js          # API service layer
    │   └── App.jsx             # Main app component
    └── index.html
```

---

## 🔑 Key Features

### **1. User Authentication**
- Email/password signup & login
- Google OAuth integration
- JWT-based session management
- Role-based access (Founder/Adopter)
- Protected routes with middleware

### **2. Startup Management**
- **Founders can:**
  - Submit startup profiles (name, tagline, description, industry, categories, logo, media)
  - Edit/update their startups
  - Track analytics (views, upvotes, feedback)
  - View detailed analytics with charts
  - Add special offers/discount codes

### **3. Discovery & Engagement**
- **Adopters can:**
  - Browse approved startups
  - Filter by category, industry, business type (B2B/B2C)
  - Search startups
  - Upvote favorite startups
  - Submit feedback (min 10 characters)
  - View startup details

### **4. Analytics Dashboard**
- View counts (total views, upvotes, feedback)
- Daily/hourly view patterns
- Engagement metrics
- Charts using Recharts

### **5. Admin Panel**
- Approve/reject startup submissions
- View all startups with filters
- Platform-wide statistics
- Manage startup status

---

## 🗄️ Database Schema (MongoDB Collections)

### **1. User Collection**
```javascript
{
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (required, enum: ['founder', 'adopter']),
  interests: [String] (optional),
  upvotedStartups: [ObjectId] (references to Startup),
  createdAt, updatedAt (timestamps)
}
```

### **2. Startup Collection**
```javascript
{
  founderId: ObjectId (references User),
  name: String (required, min 2 chars),
  tagline: String (required, min 10 chars),
  description: String (required, min 50 chars),
  industry: String (required),
  categories: [String] (required),
  businessType: String (enum: ['B2B', 'B2C']),
  targetAudience: String,
  website: String (URL validation),
  logo: String (base64 or URL),
  media: [String] (images/videos),
  status: String (enum: ['pending', 'approved', 'rejected']),
  views: Number (default: 0),
  analytics: {
    dailyViews: [{ date, count }],
    hourlyViews: [{ hour, count }]
  },
  specialOfferText: String,
  specialOfferCode: String,
  discount: Number,
  createdAt, updatedAt
}
```

### **3. Feedback Collection**
```javascript
{
  startupId: ObjectId (references Startup),
  userId: ObjectId (references User),
  comment: String (required, min 10 chars),
  createdAt, updatedAt
}
```

### **4. Upvote Collection**
```javascript
{
  startupId: ObjectId (references Startup),
  userId: ObjectId (references User),
  createdAt
}
// Unique compound index on (startupId, userId) prevents duplicates
```

---

## 🔐 Authentication Flow

1. **Signup/Login:**
   - User submits credentials
   - Backend validates and hashes password (bcrypt)
   - JWT token generated and sent via HTTP-only cookie
   - Frontend stores user info in localStorage

2. **Protected Routes:**
   - Middleware (`auth.js`) verifies JWT token
   - Checks user role (founder/adopter)
   - Attaches user info to `req.user`

3. **Google OAuth:**
   - Frontend uses `@react-oauth/google`
   - Sends access token to backend
   - Backend verifies with Google API
   - Creates/updates user and returns JWT

---

## 🛣️ API Endpoints

### **User Routes** (`/api/users`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `POST /google-login` - Google OAuth login
- `POST /logout` - Logout user

### **Startup Routes** (`/api/startups`)
- `GET /` - Get all approved startups (public/adopter feed)
- `GET /:id` - Get startup by ID (public)
- `GET /my-startups` - Get founder's startups (auth required)
- `POST /` - Create startup (founder only)
- `PUT /:startupId` - Update startup (founder only)
- `POST /:id/upvote` - Upvote startup (adopter only)
- `DELETE /:id/upvote` - Remove upvote (adopter only)
- `POST /:id/view` - Increment view count
- `GET /:startupId/analytics` - Get startup analytics (founder only)
- `GET /founder/analytics` - Get founder's overall analytics
- `GET /trending` - Get trending startups
- `GET /filter-options` - Get filter options
- `PATCH /:id/status` - Update startup status (admin only)
- `GET /admin/list` - List all startups (admin only)

### **Feedback Routes** (`/api/feedback`)
- `POST /` - Submit feedback (adopter only)
- `GET /startup/:startupId` - Get feedback for startup

### **Contact Routes** (`/api/contact`)
- `POST /` - Submit contact form (sends email via Nodemailer)

---

## 🎨 Frontend Key Components

### **Pages:**
- **Index.jsx** - Landing page with hero, features, FAQ
- **Login.jsx** - Login page with Google OAuth
- **Signup.jsx** - Registration with role selection
- **StartupsFeed.jsx** - Adopter feed with filters/search
- **FounderDashboard.jsx** - Founder's dashboard with analytics
- **AdminDashboard.jsx** - Admin panel for managing startups
- **SubmitStartup.jsx** - Form to submit/edit startups

### **Components:**
- **Header.jsx** - Navigation bar with role-based menu
- **Footer.jsx** - Footer with links and QR code
- **StartupAnalytics.jsx** - Analytics charts and metrics
- **StartupDiscovery.jsx** - Startup cards and filters

---

## 🔒 Security Features

1. **Password Security:**
   - Passwords hashed with bcrypt (10 rounds)
   - Never stored in plain text

2. **Authentication:**
   - JWT tokens in HTTP-only cookies
   - Token expiration handling
   - Middleware protects routes

3. **Authorization:**
   - Role-based access control (founder/adopter/admin)
   - Users can only edit their own startups
   - Admin-only routes protected

4. **CORS:**
   - Configured for specific origins
   - Credentials enabled for cookies

5. **Input Validation:**
   - Mongoose schema validation
   - URL validation for websites
   - Minimum length requirements

---

## 📊 Key Algorithms/Logic

### **1. View Tracking:**
- When user views a startup, increment view count
- Track daily/hourly views in analytics object
- Used for trending algorithm

### **2. Upvote System:**
- Unique compound index prevents duplicate upvotes
- One user can upvote a startup only once
- Upvote count displayed on startup cards

### **3. Trending Algorithm:**
- Based on recent upvotes and views
- Considers time decay (recent activity weighted more)
- Returns top trending startups

### **4. Analytics Calculation:**
- Aggregate views by date/hour
- Calculate engagement rates
- Show growth trends

---

## 🚀 Deployment Details

**Frontend (Vercel):**
- Auto-deploys from GitHub
- Environment variables: `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`
- Domain: `launch-signal.tech`

**Backend (Render):**
- Node.js service
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`, `FRONTEND_ORIGIN`
- Auto-deploys from GitHub

**Database:**
- MongoDB Atlas (cloud)
- Connection string in `.env`

---

## 💡 Common Interview Questions & Answers

### **Q1: Tell me about your project.**
**A:** LaunchSignal is a full-stack platform connecting startup founders with early adopters. Founders can submit their startups, track analytics, and receive feedback. Early adopters can discover new startups, upvote favorites, and provide feedback. It's built with React frontend and Node.js/Express backend, using MongoDB for data storage.

### **Q2: What was your role and what did you build?**
**A:** I built this project independently as a full-stack developer. I designed the database schema, implemented authentication with JWT, built RESTful APIs, created the React frontend with modern UI components, integrated analytics, and deployed both frontend and backend.

### **Q3: What challenges did you face?**
**A:** 
- **CORS issues:** Solved by configuring proper CORS headers and credentials
- **State management:** Used React Query for server state and React hooks for local state
- **Image upload:** Handled base64 encoding for startup logos
- **Real-time analytics:** Implemented view tracking and aggregation logic

### **Q4: How does authentication work?**
**A:** Users sign up/login, backend validates credentials and hashes passwords with bcrypt. JWT tokens are generated and sent via HTTP-only cookies. Middleware verifies tokens on protected routes and checks user roles for authorization.

### **Q5: How do you handle duplicate upvotes?**
**A:** MongoDB unique compound index on `(startupId, userId)` prevents duplicate upvotes. The application checks before creating an upvote document.

### **Q6: What's the database structure?**
**A:** MongoDB with 4 main collections: User (authentication), Startup (startup profiles), Feedback (user comments), and Upvote (user upvotes). Relationships are maintained via ObjectId references.

### **Q7: How do you track analytics?**
**A:** When a startup is viewed, we increment the view count and store daily/hourly view data in the startup's analytics object. This data is aggregated and displayed in charts using Recharts.

### **Q8: What technologies did you use and why?**
**A:** 
- **React:** Modern, component-based UI
- **Express:** Lightweight, flexible backend framework
- **MongoDB:** Flexible schema for startup data
- **JWT:** Stateless authentication
- **Tailwind CSS:** Rapid UI development
- **Vite:** Fast build tool

---

## 📝 Code Highlights to Remember

1. **JWT Middleware** (`backend/middleware/auth.js`):
   - Verifies token from cookies
   - Attaches user to request
   - Role-based checks

2. **Startup Controller** (`backend/controller/startupController.js`):
   - Handles CRUD operations
   - Analytics aggregation
   - View tracking logic

3. **API Service** (`cosmic-launch-main/src/services/api.js`):
   - Centralized API calls
   - Axios interceptors for error handling
   - Environment-based URL configuration

4. **Analytics Component** (`cosmic-launch-main/src/components/StartupAnalytics.jsx`):
   - Displays charts using Recharts
   - Shows daily/hourly patterns
   - Calculates engagement metrics

---

## 🎯 Quick Facts to Remember

- **Project Name:** LaunchSignal
- **Purpose:** Connect founders with early adopters
- **Tech Stack:** React + Node.js + Express + MongoDB
- **Database:** MongoDB (4 collections)
- **Authentication:** JWT with cookies
- **Deployment:** Vercel (frontend) + Render (backend)
- **Key Features:** Startup submission, discovery, upvoting, analytics, feedback
- **User Roles:** Founder, Adopter, Admin
- **Total API Routes:** ~20+ endpoints

---

## 🔍 Files to Review Before Interview

1. `backend/src/app.js` - Main Express setup
2. `backend/controller/startupController.js` - Core business logic
3. `backend/middleware/auth.js` - Authentication logic
4. `cosmic-launch-main/src/services/api.js` - API integration
5. `cosmic-launch-main/src/pages/FounderDashboard.jsx` - Main dashboard
6. `backend/model/startupmodel.js` - Database schema

---

**Good luck with your interview! 🚀**
