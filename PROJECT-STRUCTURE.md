# 📁 Complete Project Structure

## Overview
This document shows the complete folder structure for Phase 1 of the Patient Management System.

```
patient-management-nextjs/
│
├── .next/                              # Next.js build output (auto-generated)
├── node_modules/                       # Dependencies (auto-generated)
│
├── public/                             # Static files
│   └── (empty for now - add images/icons later)
│
├── src/                                # Source code directory
│   │
│   ├── app/                            # Next.js App Router directory
│   │   │
│   │   ├── auth/                       # Authentication pages
│   │   │   ├── signin/
│   │   │   │   └── page.tsx            # Sign-in page with email/password + Google
│   │   │   ├── signup/
│   │   │   │   └── page.tsx            # Sign-up page with form validation
│   │   │   └── phone/
│   │   │       └── page.tsx            # Phone authentication with OTP
│   │   │
│   │   ├── dashboard/                  # Protected dashboard section
│   │   │   ├── layout.tsx              # Dashboard layout with auth check
│   │   │   └── page.tsx                # Main dashboard page
│   │   │
│   │   ├── layout.tsx                  # Root layout (applies to all pages)
│   │   ├── page.tsx                    # Home page (redirects to signin)
│   │   ├── providers.tsx               # React Query + Auth providers
│   │   └── globals.css                 # Global CSS with Tailwind directives
│   │
│   ├── components/                     # React components
│   │   └── ui/                         # shadcn/ui components
│   │       ├── avatar.tsx              # Avatar component for user profile
│   │       ├── button.tsx              # Button with variants
│   │       ├── card.tsx                # Card container component
│   │       ├── dropdown-menu.tsx       # Dropdown menu for user actions
│   │       ├── input.tsx               # Form input field
│   │       ├── label.tsx               # Form label
│   │       ├── toast.tsx               # Toast notification primitive
│   │       ├── toaster.tsx             # Toast notification container
│   │       └── use-toast.ts            # Toast hook for notifications
│   │
│   ├── contexts/                       # React Context providers
│   │   └── AuthContext.tsx             # Authentication context and functions
│   │                                   # - Auth state management
│   │                                   # - Sign up/in/out functions
│   │                                   # - Google OAuth
│   │                                   # - Phone auth functions
│   │
│   ├── hooks/                          # Custom React hooks
│   │   └── useAuth.ts                  # React Query hooks for auth
│   │                                   # - useAuthUser
│   │                                   # - useSignIn
│   │                                   # - useSignUp
│   │                                   # - useGoogleSignIn
│   │                                   # - useLogout
│   │                                   # - usePhoneAuth
│   │
│   ├── lib/                            # Library configurations
│   │   ├── firebase.ts                 # Firebase client-side config
│   │   ├── firebase-admin.ts           # Firebase Admin SDK config
│   │   └── utils.ts                    # Utility functions (cn helper)
│   │
│   ├── types/                          # TypeScript type definitions
│   │   └── index.ts                    # All interfaces and types
│   │                                   # - User
│   │                                   # - AuthContextType
│   │                                   # - SignUpData
│   │                                   # - SignInData
│   │                                   # - Patient (for Phase 2)
│   │                                   # - PatientDocument
│   │
│   └── middleware.ts                   # Next.js middleware for route protection
│
├── .env.example                        # Environment variables template
├── .env.local                          # Your actual environment variables (create this)
├── .eslintrc.json                      # ESLint configuration
├── .gitignore                          # Git ignore rules
├── next.config.mjs                     # Next.js configuration
├── package.json                        # Project dependencies and scripts
├── postcss.config.mjs                  # PostCSS configuration
├── README.md                           # Main documentation
├── QUICKSTART.md                       # Quick setup guide
├── SETUP-CHECKLIST.md                  # Detailed setup checklist
├── tailwind.config.ts                  # Tailwind CSS configuration
└── tsconfig.json                       # TypeScript configuration

```

---

## 📄 File Descriptions

### Root Configuration Files

#### `package.json`
- Lists all project dependencies
- Contains npm scripts (dev, build, start, lint)
- Project metadata

#### `tsconfig.json`
- TypeScript compiler configuration
- Enables strict mode
- Configures path aliases (@/*)

#### `tailwind.config.ts`
- Tailwind CSS configuration
- Custom color schemes
- shadcn/ui integration

#### `next.config.mjs`
- Next.js configuration
- Image domain allowlist
- Server action settings

#### `.env.local` (You create this)
- Firebase API keys
- Firebase Admin credentials
- App URL configuration
- **Never commit this file!**

---

### App Router Files (`src/app/`)

#### Root Files

**`layout.tsx`**
- Root layout wrapper
- Includes fonts, metadata
- Wraps children with Providers
- Includes Toaster component

**`page.tsx`**
- Home page
- Redirects to /auth/signin

**`providers.tsx`**
- React Query client setup
- AuthProvider wrapper
- Client-side only

**`globals.css`**
- Tailwind directives
- CSS custom properties for theming
- Base styles

#### Authentication Pages (`auth/`)

**`auth/signin/page.tsx`**
- Email/password sign-in form
- Google OAuth button
- Link to phone auth
- Form validation with Zod
- Loading states
- Error handling

**`auth/signup/page.tsx`**
- User registration form
- Password confirmation
- Google OAuth option
- Form validation
- Display name collection

**`auth/phone/page.tsx`**
- Phone number input (E.164 format)
- SMS OTP verification
- reCAPTCHA integration
- Two-step flow

#### Dashboard (`dashboard/`)

**`dashboard/layout.tsx`**
- Protected layout
- Redirects to signin if not authenticated
- Loading state while checking auth

**`dashboard/page.tsx`**
- Main dashboard UI
- User profile display
- Navigation header
- User dropdown menu
- Logout functionality
- Phase 1 completion message

---

### Components (`src/components/`)

#### UI Components (`ui/`)

All UI components are from shadcn/ui library with customizations:

**`button.tsx`**
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon

**`input.tsx`**
- Standard form input
- Integrated with react-hook-form

**`label.tsx`**
- Form label component
- Accessible

**`card.tsx`**
- Card container
- CardHeader, CardContent, CardFooter
- CardTitle, CardDescription

**`avatar.tsx`**
- User avatar display
- Image with fallback
- Circular design

**`dropdown-menu.tsx`**
- Dropdown menu primitive
- Used for user menu
- Keyboard accessible

**`toast.tsx`**
- Toast notification primitive
- Success/error variants

**`toaster.tsx`**
- Toast notification container
- Manages multiple toasts

**`use-toast.ts`**
- Toast notification hook
- Global toast state

---

### Contexts (`src/contexts/`)

**`AuthContext.tsx`**
- React Context for authentication
- Manages auth state globally
- Firebase auth listener
- Authentication functions:
  - `signUp()` - Create account
  - `signIn()` - Email/password login
  - `signInWithGoogle()` - Google OAuth
  - `logout()` - Sign out
  - `sendPhoneVerificationCode()` - Send OTP
  - `verifyPhoneCode()` - Verify OTP
  - `setupRecaptcha()` - reCAPTCHA setup

---

### Hooks (`src/hooks/`)

**`useAuth.ts`**
- React Query integration for auth
- Hooks:
  - `useAuthUser()` - Get current user
  - `useSignIn()` - Sign-in mutation
  - `useSignUp()` - Sign-up mutation
  - `useGoogleSignIn()` - Google OAuth mutation
  - `useLogout()` - Logout mutation
  - `usePhoneAuth()` - Phone auth mutations

---

### Library (`src/lib/`)

**`firebase.ts`**
- Firebase client-side initialization
- Auth, Firestore, Storage instances
- Checks for browser environment

**`firebase-admin.ts`**
- Firebase Admin SDK initialization
- Server-side operations
- Admin auth and Firestore

**`utils.ts`**
- `cn()` function for className merging
- Uses clsx + tailwind-merge

---

### Types (`src/types/`)

**`index.ts`**
- All TypeScript interfaces:
  - `User` - User data structure
  - `AuthContextType` - Auth context shape
  - `SignUpData` - Sign-up form data
  - `SignInData` - Sign-in form data
  - `PhoneAuthData` - Phone auth data
  - `Patient` - Patient data (Phase 2)
  - `PatientDocument` - Patient document (Phase 2)
  - `PatientFormData` - Patient form (Phase 2)

---

### Middleware (`src/middleware.ts`)

**Purpose:**
- Route protection
- Redirects unauthenticated users to signin
- Redirects authenticated users away from auth pages

**Routes Protected:**
- All routes except: `/auth/*`, `/api/*`, static files

---

## 🎯 What's Missing (For Phase 2)

These will be added in Phase 2:

```
src/
├── app/
│   └── dashboard/
│       ├── patients/
│       │   ├── page.tsx           # Patient list
│       │   ├── [id]/
│       │   │   └── page.tsx       # Patient details
│       │   ├── new/
│       │   │   └── page.tsx       # Add patient
│       │   └── [id]/edit/
│       │       └── page.tsx       # Edit patient
│       └── ...
│
├── components/
│   ├── patients/
│   │   ├── PatientList.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PatientCard.tsx
│   │   └── ...
│   └── ui/
│       ├── data-table.tsx         # shadcn data table
│       ├── dialog.tsx             # Modal dialogs
│       ├── alert-dialog.tsx       # Confirmation dialogs
│       ├── textarea.tsx           # Text area input
│       └── ...
│
├── hooks/
│   └── usePatients.ts             # Patient CRUD hooks
│
└── lib/
    └── patients.ts                # Patient operations
```

---

## 📊 Statistics

### Current Phase 1

- **Total Files:** ~35 files
- **React Components:** 11
- **Pages:** 5
- **Hooks:** 1
- **Contexts:** 1
- **Config Files:** 7
- **Lines of Code:** ~2,500+

### Phase 2 Will Add

- **Additional Files:** ~15-20
- **New Components:** 8-10
- **New Pages:** 4-5
- **New Hooks:** 1
- **Additional Lines:** ~1,500+

---

## 🎨 Design System

### Colors (Tailwind)
- **Primary:** Blue (`hsl(221.2 83.2% 53.3%)`)
- **Secondary:** Light blue (`hsl(210 40% 96.1%)`)
- **Destructive:** Red (`hsl(0 84.2% 60.2%)`)
- **Muted:** Gray (`hsl(215.4 16.3% 46.9%)`)
- **Background:** White (`hsl(0 0% 100%)`)

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, 2xl-3xl
- **Body:** Regular, sm-base

### Spacing
- **Consistent:** 4px increments (Tailwind default)
- **Container:** Max-width 7xl with padding

---

## 🔐 Security

### Environment Variables
- Never committed to Git
- All sensitive data in `.env.local`
- Firebase keys properly scoped

### Route Protection
- Middleware checks authentication
- Server-side validation
- Client-side guards

### Firebase Rules
- Currently in test mode
- Will be secured in production

---

## 📦 Key Dependencies

### Production
- `next` ^14.2.0 - Framework
- `react` ^18.3.0 - UI library
- `firebase` ^10.11.0 - Backend
- `@tanstack/react-query` ^5.28.0 - State management
- `react-hook-form` ^7.51.0 - Forms
- `zod` ^3.23.0 - Validation
- `tailwindcss` ^3.4.3 - Styling

### UI Components
- All Radix UI primitives
- lucide-react for icons
- class-variance-authority for variants

---

**This completes the Phase 1 project structure! 🎉**
