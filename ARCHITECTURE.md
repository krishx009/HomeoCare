# 🏗️ Project Architecture - Visual Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend                          │  │
│  │                                                               │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐  │  │
│  │  │  Auth Pages   │  │   Dashboard   │  │  UI Components │  │  │
│  │  │  - Sign In    │  │  - Protected  │  │  - Button      │  │  │
│  │  │  - Sign Up    │  │  - User Info  │  │  - Input       │  │  │
│  │  │  - Phone      │  │  - Navigation │  │  - Card        │  │  │
│  │  └───────────────┘  └───────────────┘  └────────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │              React Query (TanStack Query)             │  │  │
│  │  │  - Caching    - Mutations    - State Management      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                  Auth Context                         │  │  │
│  │  │  - User State  - Auth Functions  - Session Manager   │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                                                               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              ↕                                     │
│                     Next.js Middleware                            │
│                    (Route Protection)                             │
└─────────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────────┐
│                         FIREBASE BACKEND                            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Authentication│  │  Firestore   │  │   Storage    │            │
│  │ - Email/Pass │  │  (Database)  │  │  (Files)     │            │
│  │ - Google     │  │  - Patients  │  │  - Documents │            │
│  │ - Phone/SMS  │  │  - Users     │  │  - Images    │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### 1. Email/Password Sign Up

```
User fills form
     ↓
Form validation (Zod)
     ↓
Submit button clicked
     ↓
useSignUp hook (React Query)
     ↓
signUp function (AuthContext)
     ↓
createUserWithEmailAndPassword (Firebase)
     ↓
updateProfile (add display name)
     ↓
Firebase Auth creates user
     ↓
onAuthStateChanged listener fires
     ↓
AuthContext updates user state
     ↓
React Query cache updated
     ↓
Redirect to /dashboard
     ↓
Middleware checks auth
     ↓
Dashboard loads
```

### 2. Email/Password Sign In

```
User enters credentials
     ↓
Form validation
     ↓
useSignIn hook
     ↓
signIn function
     ↓
signInWithEmailAndPassword (Firebase)
     ↓
Firebase verifies credentials
     ↓
Success: User logged in
     ↓
Auth state updated
     ↓
Redirect to /dashboard
```

### 3. Google OAuth

```
User clicks "Sign in with Google"
     ↓
useGoogleSignIn hook
     ↓
signInWithGoogle function
     ↓
GoogleAuthProvider + signInWithPopup
     ↓
Google popup opens
     ↓
User selects account
     ↓
User grants permissions
     ↓
Firebase receives OAuth token
     ↓
User authenticated
     ↓
Profile info synced
     ↓
Redirect to /dashboard
```

### 4. Phone Authentication

```
User enters phone number
     ↓
setupRecaptcha initializes
     ↓
sendPhoneVerificationCode called
     ↓
signInWithPhoneNumber (Firebase)
     ↓
reCAPTCHA challenge (invisible)
     ↓
SMS sent to phone
     ↓
User enters 6-digit code
     ↓
verifyPhoneCode called
     ↓
confirmationResult.confirm(code)
     ↓
Firebase verifies code
     ↓
User authenticated
     ↓
Redirect to /dashboard
```

---

## Route Protection Flow

```
User navigates to URL
     ↓
middleware.ts executes
     ↓
Check: Does user have session cookie?
     │
     ├─ NO ──→ Is route protected?
     │            │
     │            ├─ YES ──→ Redirect to /auth/signin
     │            └─ NO ───→ Allow access
     │
     └─ YES ──→ Is route an auth page?
                  │
                  ├─ YES ──→ Redirect to /dashboard
                  └─ NO ───→ Allow access
                                ↓
                        Page component loads
                                ↓
                        Client-side check
                                ↓
                        useAuth hook
                                ↓
                        Verify user state
                                ↓
                        Render page
```

---

## Component Hierarchy

```
App
├── RootLayout
│   ├── Providers
│   │   ├── QueryClientProvider (React Query)
│   │   └── AuthProvider (Auth Context)
│   ├── Children (pages)
│   └── Toaster (notifications)
│
├── Auth Pages (/auth/*)
│   ├── SignIn Page
│   │   ├── Card
│   │   ├── Form (react-hook-form)
│   │   ├── Input components
│   │   ├── Button components
│   │   └── useSignIn hook
│   │
│   ├── SignUp Page
│   │   ├── Card
│   │   ├── Form with validation
│   │   ├── Input components
│   │   └── useSignUp hook
│   │
│   └── Phone Page
│       ├── Card
│       ├── Phone input form
│       ├── Code verification form
│       └── usePhoneAuth hook
│
└── Dashboard (/dashboard/*)
    ├── DashboardLayout
    │   ├── Auth check (useAuth)
    │   └── Loading state
    │
    └── Dashboard Page
        ├── Header
        │   ├── Logo/Title
        │   └── User Dropdown
        │       ├── Avatar
        │       ├── User info
        │       └── Logout button
        │
        └── Main Content
            └── Welcome message
```

---

## Data Flow - State Management

### Auth State Flow

```
Firebase Auth
     ↓
onAuthStateChanged listener
     ↓
AuthContext state update
     ↓
React Query cache
     ↓
useAuth hook
     ↓
Component re-render
     ↓
UI updates
```

### Form Submission Flow

```
User input
     ↓
react-hook-form state
     ↓
Zod validation
     │
     ├─ Invalid ──→ Show errors
     │
     └─ Valid ──→ Submit
                    ↓
              React Query mutation
                    ↓
              Firebase API call
                    ↓
              Response
                    │
                    ├─ Success ──→ Toast notification
                    │              Cache update
                    │              Redirect
                    │
                    └─ Error ───→ Toast notification
                                   Show error message
```

---

## File Relationships

### Core Files and Their Connections

```
middleware.ts
     ↓ (protects routes)
app/layout.tsx
     ↓ (wraps with providers)
app/providers.tsx
     ├──→ QueryClientProvider
     │         ↓
     │    hooks/useAuth.ts
     │         ↓
     │    React Query operations
     │
     └──→ AuthProvider
               ↓
          contexts/AuthContext.tsx
               ↓
          lib/firebase.ts
               ↓
          Firebase SDK
```

### Page Loading Sequence

```
1. middleware.ts (server)
   ↓
2. app/layout.tsx (server + client)
   ↓
3. app/providers.tsx (client)
   ↓
4. contexts/AuthContext.tsx (client)
   ↓
5. Page component (client)
   ↓
6. UI components (client)
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  React Components + Tailwind CSS    │
│  shadcn/ui + lucide-react icons     │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│        Application Layer            │
│  Next.js 14 (App Router)            │
│  React 18 + TypeScript              │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│         State Management            │
│  React Query + React Context        │
│  react-hook-form + Zod validation   │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│          API Layer                  │
│  Firebase SDK (Client + Admin)      │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│         Backend Services            │
│  Firebase Authentication            │
│  Cloud Firestore                    │
│  Firebase Storage                   │
└─────────────────────────────────────┘
```

---

## Request/Response Cycle

### Authentication Request

```
CLIENT                    NEXT.JS                 FIREBASE
  │                          │                       │
  ├─── Sign in form ────────→│                       │
  │                          │                       │
  │                          ├─ Validate form        │
  │                          │                       │
  │                          ├─ Call auth hook       │
  │                          │                       │
  │                          ├─── Auth request ─────→│
  │                          │                       │
  │                          │                       ├─ Verify credentials
  │                          │                       │
  │                          │←─── Auth token ───────┤
  │                          │                       │
  │                          ├─ Update context       │
  │                          │                       │
  │                          ├─ Update React Query   │
  │                          │                       │
  │←─── Redirect /dashboard ┤                       │
  │                          │                       │
```

### Protected Page Access

```
CLIENT              MIDDLEWARE           DASHBOARD          FIREBASE
  │                      │                   │                 │
  ├─ Request /dashboard ─→│                  │                 │
  │                      │                   │                 │
  │                      ├─ Check session    │                 │
  │                      │                   │                 │
  │                      ├─ Authenticated?   │                 │
  │                      │   YES             │                 │
  │                      │                   │                 │
  │                      ├─ Allow request ───→│                │
  │                      │                   │                 │
  │                      │                   ├─ Check user ────→│
  │                      │                   │                 │
  │                      │                   │←─ User data ────┤
  │                      │                   │                 │
  │←─────── Dashboard page ──────────────────┤                 │
  │                      │                   │                 │
```

---

## Security Model

```
┌─────────────────────────────────────────┐
│          Client-Side Security           │
│                                         │
│  • Environment variables (NEXT_PUBLIC)  │
│  • Form validation (Zod)                │
│  • Input sanitization                   │
│  • XSS prevention (React)               │
│  • CSRF protection (Next.js)            │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│        Middleware Security              │
│                                         │
│  • Route protection                     │
│  • Session validation                   │
│  • Redirect rules                       │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         Firebase Security               │
│                                         │
│  • Authentication required              │
│  • Firestore security rules             │
│  • Storage security rules               │
│  • API key restrictions                 │
│  • CORS configuration                   │
└─────────────────────────────────────────┘
```

---

## Development vs Production

### Development Environment

```
localhost:3000
     ↓
Next.js Dev Server
     ↓
Hot Module Replacement
     ↓
Source Maps
     ↓
Development Firebase Project
```

### Production Environment

```
Production Domain
     ↓
Vercel/Netlify/Server
     ↓
Optimized Build
     ↓
Minified Code
     ↓
Production Firebase Project
```

---

## Cache Strategy

```
React Query Cache Layers:

┌──────────────────────────┐
│   Browser Memory         │  ← Active queries
│   (staleTime: 1 min)     │
└──────────────────────────┘
          ↕
┌──────────────────────────┐
│   Background Refetch     │  ← Auto-refresh
│   (refetchOnWindowFocus) │
└──────────────────────────┘
          ↕
┌──────────────────────────┐
│   Firebase Cache         │  ← Offline persistence
│   (IndexedDB)            │
└──────────────────────────┘
```

---

## Error Handling Flow

```
Error occurs
     ↓
Try-catch block
     ↓
Error type check
     │
     ├─ Firebase Error
     │    ↓
     │  Format error message
     │    ↓
     │  Show toast notification
     │    ↓
     │  Log to console (dev)
     │
     ├─ Validation Error
     │    ↓
     │  Show field error
     │    ↓
     │  Highlight input
     │
     └─ Network Error
          ↓
        Show retry option
          ↓
        Offline message
```

---

## This Visual Guide Shows:

✅ System architecture
✅ Authentication flows
✅ Route protection
✅ Component hierarchy
✅ Data flow patterns
✅ Technology stack
✅ Request/response cycles
✅ Security model
✅ Cache strategy
✅ Error handling

**Use this to understand how everything connects!**
