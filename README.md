# HomeCare Patient Management System

## 🏥 Complete Medical Practice Management Solution

A comprehensive Next.js patient management system with Firebase authentication and MongoDB database for doctors and medical practices.

---

## 🎯 Project Status

### ✅ Phase 1: Authentication System (COMPLETE)
- Email/Password authentication
- Google OAuth integration
- Phone number verification
- Protected routes
- User session management
- Professional medical UI

### ✅ Phase 2: Patient CRUD with MongoDB (COMPLETE)
- Patient management (Create, Read, Update, Delete)
- MongoDB Atlas integration
- Search functionality
- BMI calculation and tracking
- React Query state management
- Optimistic UI updates
- Data table with sorting

### 🚀 Phase 3: Advanced Features (PLANNED)
- File uploads (patient documents, photos)
- Appointment scheduling
- Prescription management
- Dashboard analytics
- Export/Print functionality

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Documentation](#documentation)
8. [Technology Stack](#technology-stack)
9. [Project Structure](#project-structure)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd patient-management-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and MongoDB credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

**First Time Setup?** → See [PHASE1-COMPLETE.md](docs/PHASE1-COMPLETE.md) and [PHASE2-SETUP.md](docs/PHASE2-SETUP.md)

---

## ✨ Features

### Authentication (Phase 1)
- ✅ Email/Password sign in and sign up
- ✅ Google OAuth authentication
- ✅ Phone number with SMS verification
- ✅ Password reset functionality
- ✅ Protected routes with middleware
- ✅ Persistent user sessions
- ✅ Sign out functionality

### Patient Management (Phase 2)
- ✅ Create new patients with validation
- ✅ View patient details and medical history
- ✅ Update patient information
- ✅ Delete patients with confirmation
- ✅ Search patients by name (real-time)
- ✅ BMI calculation with color-coded categories
- ✅ Responsive data table
- ✅ Doctor-specific data isolation
- ✅ Optimistic UI updates for smooth UX

### UI/UX
- ✅ Professional medical-themed design
- ✅ Responsive mobile-first layout
- ✅ Toast notifications for actions
- ✅ Loading states and skeletons
- ✅ Error handling with user-friendly messages
- ✅ Accessible forms with validation
- ✅ Keyboard navigation support

---

## ✅ Prerequisites

Before starting, ensure you have:

- **Node.js** 18.17 or later
- **npm** or **yarn** package manager
- **Google account** (for Firebase)
- **MongoDB Atlas account** (free tier)
- **Code editor** (VS Code recommended)
- Basic knowledge of React, TypeScript, and Next.js

---

## 📦 Installation

```bash
# Install dependencies
npm install
```

**Dependencies installed:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Firebase & Firebase Admin SDK
- Mongoose (MongoDB ODM)
- React Query (TanStack Query)
- react-hook-form + Zod validation
- shadcn/ui components
- Tailwind CSS

---

## ⚙️ Configuration

### 1. Firebase Setup

See detailed instructions in [docs/PHASE1-COMPLETE.md](docs/PHASE1-COMPLETE.md)

**Quick summary:**
1. Create Firebase project at https://console.firebase.google.com
2. Enable authentication methods: Email/Password, Google, Phone
3. Get web app configuration (API keys)
4. Generate Admin SDK service account key

### 2. MongoDB Atlas Setup

See detailed instructions in [docs/PHASE2-SETUP.md](docs/PHASE2-SETUP.md)

**Quick summary:**
1. Create account at https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Create database user with read/write permissions
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string

### Step 1: Navigate to Project Directory

Open your terminal and navigate to the project folder:

```bash
cd "c:\Users\krish\OneDrive\Documents\04 Project files\Self\HomeoDoc\homeocare\patient-management-nextjs"
```

### Step 2: Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

This will install all required packages including:
- Next.js 14+
- React 18+
- Firebase
- shadcn/ui components
- React Query (TanStack Query)
- React Hook Form + Zod
- Tailwind CSS

---

## ⚙️ Environment Configuration

### Step 1: Create Environment File
### 3. Environment Variables

Create `.env.local` file in project root:

```bash
# Copy from example
cp .env.example .env.local
```

Fill in your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=your_project
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homeocare?retryWrites=true&w=majority

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

Application runs at: **http://localhost:3000**

---

## 📚 Documentation

### Complete Guides:
- **[PHASE1-COMPLETE.md](docs/PHASE1-COMPLETE.md)** - Authentication system details
- **[PHASE2-COMPLETE.md](docs/PHASE2-COMPLETE.md)** - Patient management features
- **[PHASE2-SETUP.md](docs/PHASE2-SETUP.md)** - Step-by-step setup guide
- **[PHASE2-FILES.md](docs/PHASE2-FILES.md)** - All files created in Phase 2
- **[PHASE2-TESTING-CHECKLIST.md](docs/PHASE2-TESTING-CHECKLIST.md)** - Comprehensive testing guide

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: react-hook-form + Zod validation
- **State Management**: React Query (TanStack Query)

### Backend
- **Runtime**: Next.js API Routes (Server-side)
- **Authentication**: Firebase Auth
- **Database**: MongoDB Atlas (Free tier)
- **ODM**: Mongoose
- **Auth Verification**: Firebase Admin SDK

### Dev Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Code Formatting**: Prettier (optional)

---
  - shadcn/ui components
  - Toast notifications for feedback
  - Loading spinners for async operations
  - User profile dropdown with avatar

---

## 📁 Project Structure

```
patient-management-nextjs/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx          # Sign in page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx          # Sign up page
│   │   │   └── phone/
│   │   │       └── page.tsx          # Phone auth page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Protected layout
│   │   │   └── page.tsx              # Dashboard page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page (redirects)
│   │   ├── providers.tsx             # React Query + Auth providers
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── card.tsx
│   │       ├── avatar.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       └── use-toast.ts
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth context & functions
│   ├── hooks/
│   │   └── useAuth.ts                # React Query auth hooks
│   ├── lib/
│   │   ├── firebase.ts               # Firebase client config
│   │   ├── firebase-admin.ts         # Firebase admin config
│   │   └── utils.ts                  # Utility functions
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   └── middleware.ts                 # Route protection
├── .env.example                      # Environment template
├── .env.local                        # Your environment variables (create this)
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🧪 Testing Authentication

### Test Email/Password Authentication

1. Navigate to http://localhost:3000
2. Click **"Sign Up"**
3. Fill in:
   - Full Name: `Dr. John Doe`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
4. Click **"Create Account"**
5. You should be redirected to the dashboard
6. Log out and sign in again with the same credentials

### Test Google Authentication

1. Click **"Sign in with Google"**
2. Select your Google account
3. Grant permissions
4. You should be redirected to the dashboard

### Test Phone Authentication

1. Click **"Sign in with Phone Number"**
2. Enter phone number in E.164 format (e.g., `+1234567890`)
3. Click **"Send Verification Code"**
4. Check your phone for SMS
5. Enter the 6-digit code
6. Click **"Verify Code"**
7. You should be redirected to the dashboard

### Test Protected Routes

1. Log out from the dashboard
2. Try to access http://localhost:3000/dashboard directly
3. You should be automatically redirected to the sign-in page

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Firebase Configuration Error

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**
- Double-check your `.env.local` file
- Ensure all Firebase values are correct
- Make sure there are no extra spaces
- Restart the development server after changing `.env.local`

#### 2. Phone Authentication Not Working

**Error:** `reCAPTCHA verification failed`

**Solution:**
- Ensure you're testing on `localhost` (reCAPTCHA works on localhost and registered domains)
- Check Firebase Console → Authentication → Settings → Authorized domains
- Add your domain if deploying to production

#### 3. Module Not Found Errors

**Error:** `Cannot find module '@/components/ui/button'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### 4. TypeScript Errors

**Error:** Type errors in various files

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### 5. Firebase Admin SDK Error

**Error:** `Failed to parse private key`

**Solution:**
- Ensure the private key in `.env.local` is wrapped in quotes
- Keep all `\n` characters in the key
- The key should look like: `"-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"`

#### 6. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use a different port
npm run dev -- -p 3001
```

---

## 🎯 Next Steps

### Phase 1 is Complete! ✅

You now have a fully functional authentication system. Here's what's ready:

- ✅ Next.js 14 with App Router
- ✅ Firebase Authentication (Email, Google, Phone)
- ✅ Protected routes with middleware
- ✅ User session management with React Query
- ✅ Professional UI with shadcn/ui
- ✅ Responsive design
- ✅ TypeScript strict mode
- ✅ Form validation with Zod

### Ready for Phase 2: Patient CRUD Operations

When you're ready, we'll implement:
- Patient list with data table
- Add new patient form
- View patient details
- Edit patient information
- Delete patient with confirmation
- Search and filter functionality
- Real-time updates with Firestore

---

## 📝 Additional Notes

### Firebase Security Rules (Add Later)

For production, you'll need to update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patients/{patientId} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == resource.data.doctorId;
    }
  }
}
```

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Firebase Explorer

### Useful Commands

```bash
# Format code
npm run lint

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start production server
npm start
```

---

## 🎉 Congratulations!

Phase 1 is complete! You now have a solid foundation with:
- Modern Next.js architecture
- Secure authentication
- Professional UI
- Type-safe code
- Production-ready structure

Let me know when you're ready to proceed to **Phase 2: Patient CRUD Operations**!

---

## 📞 Support

If you encounter any issues:
1. Check the Troubleshooting section above
2. Review Firebase Console for any error messages
3. Check the browser console for client-side errors
4. Check the terminal for server-side errors

---

**Built with ❤️ for Healthcare Professionals**
