# Travel Itinerary Frontend

**A modern React application that centralizes travel planning in one organized platform - solving the problem of scattered trip information across multiple apps and emails.**

---

## 📋 Table of Contents

- [📖 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🚀 Live Demo](#-live-demo)
- [🚀 How to Run the Application](#-how-to-run-the-application)
- [🏗️ Project Structure Overview](#️-project-structure-overview)
- [📝 Common Issues & Solutions](#-common-issues--solutions)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture & Design](#️-architecture--design)
- [🏢 Enterprise Best Practices](#-enterprise-best-practices)

---

## 📖 Project Overview

### What is this application?

The **Travel Itinerary Planner** is a full-stack web application designed to help travelers organize and manage their trips in one centralized platform. Built with React and powered by a Django REST API backend, this application provides an intuitive interface for creating detailed travel plans, tracking activities, and sharing experiences with others.

### Real-World Problem

**The Problem:** Travelers struggle with trip information scattered across emails, booking sites, and notes apps - leading to lost reservations, no centralized view, and difficulty sharing experiences.

**My Solution:** A single platform that centralizes trip management with:
- **Status Lifecycle** - Track trips from Planning → Ongoing → Completed
- **Activity Management** - Day-by-day itinerary with descriptions
- **Cloud Storage** - Images via Cloudinary
- **Privacy Controls** - Public sharing with private status
- **Smart Features** - Auto-suggested status based on dates, JWT authentication, SendGrid password reset

**Built for:** Individual travelers, group coordinators, travel enthusiasts, and digital nomads.

---

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration** - Email-based account creation with validation
- **JWT Authentication** - Token-based login with automatic refresh
- **Password Reset** - Email-powered password recovery via SendGrid
- **Profile Management** - Update personal details and profile image
- **Protected Routes** - Automatic authentication guards

### 🗺️ Itinerary Management
- **Create Trips** - Title, destination, start/end dates with validation
- **Status Lifecycle** - Track trips through Planning → Ongoing → Completed
- **Auto-Suggest Status** - Intelligent status suggestions based on dates
- **Image Uploads** - Multiple photos per trip via Cloudinary integration
- **Edit & Delete** - Full CRUD operations on your itineraries
- **Privacy Controls** - Toggle between public and private visibility

### 📅 Activity Planning
- **Day-by-Day Organization** - Structure activities by trip day
- **Rich Descriptions** - Detailed activity information
- **Real-time Updates** - Instant add, edit, and delete operations
- **Flexible Structure** - Optional day numbers for unscheduled activities

### 🌍 Public Sharing & Discovery
- **Explore Page** - Browse public trips from other travelers
- **Detailed Views** - See complete itineraries with photos and activities
- **Guest Access** - View public trips without authentication
- **Call-to-Action** - Encourage users to create their own itineraries

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach, works on all devices
- **Loading States** - Smooth loading indicators for better UX
- **Error Handling** - User-friendly error messages with retry options
- **Status Badges** - Visual indicators for trip status with color coding
- **Consistent UI** - Unified design system across all pages

### 🔒 Security Features
- **JWT Tokens** - Secure access and refresh token system
- **Token Auto-Refresh** - Seamless session management
- **User-Scoped Data** - Users only see their own private data
- **Public/Private Separation** - Clear boundaries for data access
- **CORS Protection** - Proper cross-origin resource sharing configuration

---

## 🚀 Live Demo

The application is fully deployed and accessible online:

**Frontend:** https://travel-itinerary-frontend-5oyl.onrender.com

**Backend API:** https://travel-itinerary-backend-yvk7.onrender.com/api

### ⚠️ Important Note

The free tier on Render spins down after inactivity. The first request may take up to **1 minute** to start up. Please be patient!

### Testing the Live API

The easiest way to test the API is using the interactive Swagger documentation:

👉 **Visit:** https://travel-itinerary-backend-yvk7.onrender.com/api/docs/

Swagger provides a user-friendly interface to test all endpoints directly in your browser. You can also use tools like Postman or cURL if you prefer.

### Backend Repository

The backend Django application is available at:
https://github.com/warishaak/travel-itinerary-backend.git

---

## 🚀 How to Run the Application

### 📋 Detailed Prerequisites

Before you begin, ensure you have the following installed on your machine:

#### Required Software

1. **Node.js** (v22.22.0 or later recommended)

2. **npm** (v10.x.x or later, comes bundled with Node.js)

3. **Git** (v2.x.x or later)

---

### 🔧 Step-by-Step Setup

#### Step 1: Clone the Repository

```bash
# Clone the frontend repository
git clone https://github.com/yourusername/travel-itinerary-frontend.git


#### Step 2: Install Dependencies

npm install

# This will create a node_modules folder and may take 1-2 minutes
```


#### Step 3: Set Up Environment Variables

Create a `.env` file in the **root directory** of the project:

```bash
# Create the .env file (Mac/Linux)
touch .env

# OR manually create it in your code editor
```

**Add the following environment variables to `.env`:**

```env
# Backend API Configuration
VITE_API_URL=http://localhost:8000

# Cloudinary Configuration 
VITE_CLOUDINARY_CLOUD_NAME=dkelru3h7
VITE_CLOUDINARY_UPLOAD_PRESET=travel-itinerary
```

#### Step 4: Connect to Backend

##### Local Backend (⭐ Recommended for Development)

**Benefits:**
- Full debugging capabilities
- Faster response times (no network latency)
- Isolated development environment
- Database changes don't affect production

**Setup Instructions:**

1. **Clone the backend repository** (in a separate directory):
   ```bash
   # Navigate to your projects folder
   cd /Users/kaleemw/IdeaProjects

   # Clone the backend
   git clone https://github.com/warishaak/travel-itinerary-backend.git
   cd travel-itinerary-backend
   ```

2. **Set up the backend** (follow the backend README):

4. **Verify backend is running:**
   - Open browser to: http://localhost:8000/api
   - You should see the API root or a JSON response
   - Check Swagger docs: http://localhost:8000/api/docs/

5. **Ensure `.env` points to local backend:**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

---

### ▶️ Running the Application

#### Step 5: Start the Development Server

```bash
# Start the Vite development server
npm run dev
```

**Access the application:**
- 🌐 Open your browser to: http://localhost:5173
- 🔄 The app will automatically reload when you save changes to the code (Hot Module Replacement)

---

## 🏗️ Project Structure Overview

Understanding the project structure will help you navigate the codebase:

```
travel-itinerary-frontend/
├── public/                 # Static assets (favicon, images)
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ErrorState.jsx  # Error display component
│   │   ├── Navbar.jsx      # Navigation bar
│   │   └── StatusBadge.jsx # Trip status badge
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx # Authentication state
│   ├── hooks/              # Custom React hooks
│   │   ├── useAsyncData.js # Data fetching hook
│   │   ├── useForm.js      # Form handling hook
│   │   └── useImageUpload.js # Image upload hook
│   ├── pages/              # Page-level components
│   │   ├── Home.jsx        # Homepage
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── ItineraryList.jsx # List of itineraries
│   │   └── ...
│   ├── services/           # API client and interceptors
│   │   ├── api.js          # Axios instance
│   │   └── interceptors.js # Request/response middleware
│   ├── utils/              # Utility functions
│   │   ├── validation.js   # Form validation helpers
│   │   ├── errorUtils.js   # Error parsing utilities
│   │   └── itineraryUtils.js # Itinerary-specific helpers
│   ├── constants/          # Theme and configuration constants
│   ├── config/             # Centralized app configuration
│   ├── App.jsx             # Main app component (routes)
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables (not committed)
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── index.html              # HTML entry point
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

---

### 📜 Available npm Scripts

#### Development Scripts

```bash
# Start development server with hot reload
npm run dev
```

#### Testing Scripts

```bash
# Run all tests once
npm run test

# Run tests in watch mode (auto re-run on file changes)
npm run test:ui

# Generate test coverage report
npm run test:coverage
```

#### Code Quality Scripts

```bash
# Run ESLint to check code quality
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Pre-push checks (lint + test + build)
npm run prepush
```

---

### 🚀 Deployment

**Current Deployment:**
- **Frontend:** https://travel-itinerary-frontend-5oyl.onrender.com
- **Backend:** https://travel-itinerary-backend-yvk7.onrender.com

**Deployment Process:**
- Hosted on **Render** (free tier)
- **Auto-deploy** on push to `main` branch
- Build logs available in Render dashboard

---

## 📝 Common Issues & Solutions

### Quick Troubleshooting

**Port 5173 already in use**
```bash
lsof -ti:5173 | xargs kill -9
# Or use a different port: npm run dev -- --port 3000
```

**API Connection Failed / CORS Error**
- ✅ Verify backend is running: `curl http://localhost:8000/api`
- ✅ Check `.env` has correct `VITE_API_URL`
- ✅ Restart both frontend and backend servers

**Environment Variables Not Loading**
- ✅ Ensure variables start with `VITE_`
- ✅ Restart dev server after changing `.env`
- ✅ Verify `.env` is in project root (not in `src/`)

**Module Not Found Errors**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**White Screen / Blank Page**
- ✅ Check browser console (F12) for errors
- ✅ Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- ✅ Clear build cache: `rm -rf node_modules/.vite`

**Cloudinary Upload Fails**
- ✅ Verify credentials in `.env`
- ✅ Check upload preset is set to "Unsigned" in Cloudinary dashboard
- ✅ Ensure file size is under 10MB (free tier limit)

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern UI library with hooks
- **Vite 8.0** - Fast build tool and dev server
- **React Router 7.13** - Client-side routing
- **JavaScript (ES6+)** - Modern JavaScript features
- **Context API** - State management for authentication
- **CSS-in-JS** - Inline styles with theme constants

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework 3.16** - RESTful API toolkit
- **djangorestframework-simplejwt** - JWT authentication
- **PostgreSQL 14+** - Relational database
- **Gunicorn** - WSGI HTTP server
- **WhiteNoise** - Static file serving

### External Services
- **Cloudinary** - Cloud-based image storage and management
- **SendGrid** - Transactional email service (password reset)
- **Render** - Cloud hosting platform (frontend + backend)

### Development Tools
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting and style checking
- **Prettier** - Code formatting
- **Git** - Version control
- **npm** - Package management

### Architecture Patterns
- **Three-Layer Architecture** - Frontend → API → Database
- **RESTful API** - Resource-based endpoint design
- **JWT Authentication** - Stateless token-based auth
- **Component-Based UI** - Reusable React components
- **Custom Hooks** - Shared logic (useForm, useAsyncData, useImageUpload)
- **Utility Modules** - DRY principle (validation, error parsing, itinerary helpers)
- **API Interceptors** - Request/response middleware

---

## 🏗️ Architecture & Design

### System Architecture Model

This application follows a **three-layer enterprise architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│                    (React Application)                      │
│                                                             │
│  • Client-side UI rendering and user interaction            │
│  • React 19 with Vite build system                          │
│  • React Router for client-side routing                     │
│  • JWT token storage and management                         │
│  • NO direct database access                                |
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS/REST API
                        │ (JSON requests/responses)
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   MIDDLEWARE LAYER                          │
│                (Django REST Framework)                      │
│                                                             │
│  • Authentication & Authorization (JWT)                     │
│  • Business logic & validation                              │
│  • API endpoints & request handling                         │
│  • Database communication (ORM)                             │
│  • External service integration (Cloudinary, SendGrid)      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ ORM (Django Models)
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    BACKEND LAYER                            │
│                  (PostgreSQL Database)                      │
│                                                             │
│  • Persistent data storage                                  │
│  • Relational data integrity                                │
│  • Indexed queries for performance                          │
│  • NO direct frontend access                                |
└─────────────────────────────────────────────────────────────┘
```

### Communication Rules

**✅ Allowed:**
- Frontend → Middleware (via REST API)
- Middleware → Backend (via Django ORM)

**❌ Prohibited:**
- Frontend → Backend (direct database access)
- Frontend bypassing middleware

### Layer Responsibilities

#### **Frontend Layer**
- **What it does:** User interface, form validation (client-side), routing, JWT storage
- **What it doesn't do:** Business logic, authorization decisions, direct data persistence
- **Communication:** REST API calls to middleware only

#### **Middleware Layer**
- **What it does:**
  - Authentication (JWT generation/validation)
  - Authorization (permission checks)
  - Business logic (status transitions, ownership rules)
  - Validation (server-side form validation)
  - Database operations (via ORM)
- **What it doesn't do:** UI rendering, client-side routing
- **Communication:** Receives HTTP requests from frontend, queries database via ORM

#### **Backend Layer**
- **What it does:** Data storage, referential integrity, query optimization
- **What it doesn't do:** Business logic, authentication, API handling
- **Communication:** Accessed exclusively through middleware ORM



---


### Enterprise Features Implemented

This application demonstrates enterprise-level software engineering principles:

- **Three-Layer Architecture**: React frontend ↔ Django REST API ↔ PostgreSQL database
- **Secure Authentication**: JWT-based authentication with protected routes
- **External Service Integration**:
  - Cloudinary for image storage and management
  - SendGrid for transactional emails (password reset)
- **Status Lifecycle Management**: Business logic for trip status transitions with validation
- **Privacy Controls**: Field-level access control (status visible only to owner)
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Modern Tech Stack**: React with hooks, React Router, modern JavaScript (ES6+)
- **Code Quality**: ESLint, Prettier, Vitest for testing
- **CI/CD Pipeline**: Automated deployment via Render

---

## 🏢 Enterprise Best Practices

This frontend is built following **enterprise architecture principles** to ensure it is:

### 🔒 Secure
- **JWT Authentication** with automatic token refresh
- **Input validation** to prevent malicious data
- **No sensitive data** in code (all in `.env`)
- **Protection** against XSS, CORS issues, and common vulnerabilities

### 📈 Scalable
- **Stateless architecture** (JWT, no server sessions)
- **CDN-ready** static builds for global distribution
- **Efficient state management** with custom hooks
- **Code splitting** and optimization for performance

### 🛠️ Maintainable
- **Modular architecture** with clear separation of concerns
- **DRY principle** - reusable hooks, utilities, and components
- **Code quality tools** - ESLint, Prettier, Vitest
- **Comprehensive documentation** and clear naming conventions

### 🔧 Extensible
- **Service layer abstraction** for easy API additions
- **Custom hooks pattern** for shareable logic
- **Feature flags** support via environment variables
- **Interceptor pattern** for cross-cutting concerns


---
