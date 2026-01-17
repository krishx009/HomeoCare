# 📋 Setup Checklist - Phase 1

Use this checklist to ensure everything is set up correctly.

## ✅ Pre-Setup Checklist

- [ ] Node.js 18.17+ installed
- [ ] npm or yarn installed
- [ ] Google account created
- [ ] Code editor installed (VS Code recommended)

---

## 🔥 Firebase Setup Checklist

### Firebase Project Creation
- [ ] Created Firebase project at console.firebase.google.com
- [ ] Project name chosen (e.g., "patient-management-system")
- [ ] Google Analytics disabled (optional)

### Authentication Setup
- [ ] Opened Firebase Console → Authentication
- [ ] Clicked "Get started"
- [ ] Enabled Email/Password authentication
- [ ] Enabled Google authentication
  - [ ] Selected support email
- [ ] Enabled Phone authentication

### Firestore Database
- [ ] Opened Firebase Console → Firestore Database
- [ ] Created database in test mode
- [ ] Selected closest region

### Firebase Storage
- [ ] Opened Firebase Console → Storage
- [ ] Created storage in test mode

### Web App Registration
- [ ] Registered web app in Firebase Console
- [ ] App nickname: "patient-management-web"
- [ ] Copied Firebase configuration object
- [ ] Saved configuration for later use

### Service Account Key
- [ ] Downloaded Firebase Admin SDK private key
- [ ] Saved JSON file securely
- [ ] Extracted required values:
  - [ ] project_id
  - [ ] client_email
  - [ ] private_key

---

## 💻 Project Setup Checklist

### Installation
- [ ] Navigated to project directory
- [ ] Ran `npm install` (or `yarn install`)
- [ ] All dependencies installed without errors

### Environment Configuration
- [ ] Created `.env.local` file (copied from `.env.example`)
- [ ] Added Firebase client config:
  - [ ] NEXT_PUBLIC_FIREBASE_API_KEY
  - [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  - [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
  - [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  - [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  - [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] Added Firebase Admin config:
  - [ ] FIREBASE_ADMIN_PROJECT_ID
  - [ ] FIREBASE_ADMIN_CLIENT_EMAIL
  - [ ] FIREBASE_ADMIN_PRIVATE_KEY (with quotes and \n preserved)
- [ ] Added app URL: NEXT_PUBLIC_APP_URL=http://localhost:3000

### First Run
- [ ] Ran `npm run dev`
- [ ] Development server started successfully
- [ ] No errors in terminal
- [ ] Application accessible at http://localhost:3000

---

## 🧪 Testing Checklist

### Email/Password Authentication
- [ ] Navigated to sign up page
- [ ] Created account with test email
- [ ] Received success toast notification
- [ ] Redirected to dashboard
- [ ] Logged out successfully
- [ ] Logged back in with same credentials
- [ ] Sign-in successful

### Google Authentication
- [ ] Clicked "Sign in with Google" button
- [ ] Google popup appeared
- [ ] Selected Google account
- [ ] Granted permissions
- [ ] Redirected to dashboard
- [ ] User information displayed correctly
- [ ] Avatar shows Google profile picture

### Phone Authentication
- [ ] Clicked "Sign in with Phone Number"
- [ ] Entered phone number in E.164 format
- [ ] Received SMS with verification code
- [ ] Entered verification code
- [ ] Successfully authenticated
- [ ] Redirected to dashboard

### Route Protection
- [ ] Logged out from dashboard
- [ ] Attempted to access /dashboard directly
- [ ] Automatically redirected to sign-in page
- [ ] Logged in
- [ ] Attempted to access /auth/signin
- [ ] Automatically redirected to dashboard

### UI/UX
- [ ] All pages are responsive (tested on mobile, tablet, desktop)
- [ ] Toast notifications appear correctly
- [ ] Loading spinners show during async operations
- [ ] Form validation works (shows error messages)
- [ ] User dropdown menu works
- [ ] Avatar displays correctly
- [ ] Navigation is smooth

---

## 🎨 Visual Inspection Checklist

### Sign In Page
- [ ] Card centered on page
- [ ] Blue gradient background
- [ ] Email input field present
- [ ] Password input field present
- [ ] "Sign In" button present
- [ ] "Sign in with Google" button present
- [ ] "Sign in with Phone Number" link present
- [ ] "Sign Up" link present
- [ ] All elements properly styled

### Sign Up Page
- [ ] Full Name input field present
- [ ] Email input field present
- [ ] Password input field present
- [ ] Confirm Password input field present
- [ ] "Create Account" button present
- [ ] "Sign up with Google" button present
- [ ] "Sign In" link present
- [ ] Password mismatch validation works

### Phone Auth Page
- [ ] Phone number input with format hint
- [ ] "Send Verification Code" button present
- [ ] After sending code:
  - [ ] Verification code input appears
  - [ ] "Verify Code" button present
  - [ ] "Use Different Number" button present

### Dashboard
- [ ] Header with "Patient Management System" title
- [ ] User avatar in top-right corner
- [ ] Dropdown menu shows user info
- [ ] "Profile" option in dropdown
- [ ] "Log out" option in dropdown
- [ ] Welcome message displays user name
- [ ] Phase 1 complete message visible
- [ ] Clean, professional design

---

## 🐛 Troubleshooting Checklist

If something doesn't work, check:

- [ ] `.env.local` file exists in project root
- [ ] All environment variables are set (no placeholders)
- [ ] No extra spaces in environment variables
- [ ] Private key has proper format with \n characters
- [ ] Development server was restarted after changing .env.local
- [ ] Firebase Console shows no errors
- [ ] Browser console shows no errors
- [ ] Terminal shows no errors
- [ ] Internet connection is active
- [ ] Firebase services are not down (check status.firebase.google.com)

---

## 📊 Phase 1 Completion Checklist

Before moving to Phase 2, ensure:

- [ ] All authentication methods work (Email, Google, Phone)
- [ ] Route protection is working
- [ ] User session persists after page refresh
- [ ] Logout works correctly
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Application is responsive
- [ ] Toast notifications work
- [ ] Form validation works
- [ ] Loading states are visible
- [ ] All pages are accessible
- [ ] Firebase connection is stable

---

## 🎯 Ready for Phase 2?

If all items above are checked, you're ready to proceed to **Phase 2: Patient CRUD Operations**!

Phase 2 will include:
- Patient list with data table
- Add patient form
- View patient details
- Edit patient information
- Delete patient with confirmation
- Search and filter
- Real-time updates

---

## 📝 Notes Section

Use this space to note any issues or customizations:

```
Date: _______________

Issues encountered:
1. _____________________________________
2. _____________________________________
3. _____________________________________

Resolutions:
1. _____________________________________
2. _____________________________________
3. _____________________________________

Customizations made:
1. _____________________________________
2. _____________________________________
3. _____________________________________
```

---

**✅ Phase 1 Complete!** Great job! 🎉
