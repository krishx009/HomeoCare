# Patient Management System - Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "patient-management-system"
3. Enable Authentication methods:
   - Email/Password ✅
   - Google ✅
   - Phone ✅
4. Create Firestore Database (test mode)
5. Create Storage (test mode)
6. Get your config from Project Settings

### 2. Install & Configure
```bash
cd patient-management-nextjs
npm install
copy .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### 3. Run
```bash
npm run dev
```

Visit: http://localhost:3000

## 📚 Full Documentation
See [README.md](README.md) for complete setup instructions.

## ✅ Phase 1 Complete
- ✅ Authentication (Email, Google, Phone)
- ✅ Protected routes
- ✅ User session management
- ✅ Responsive UI

## 🎯 Next: Phase 2
- Patient CRUD operations
- Search & filter
- Real-time updates
