# 🚀 AtoZ Service Hub

A hyperlocal multi-service platform with Instagram-style feed for discovering nearby service providers.

**Stack:** Next.js 14 · Firebase · Tailwind CSS · Vercel

---

## 📁 Project Structure

```
atoz-service-hub/
├── src/
│   ├── app/
│   │   ├── auth/page.tsx          # OTP login/signup
│   │   ├── home/page.tsx          # Provider feed (main page)
│   │   ├── requests/page.tsx      # Service requests feed
│   │   ├── profile/page.tsx       # User profile
│   │   ├── provider-register/     # Provider onboarding form
│   │   ├── admin/page.tsx         # Admin approval panel
│   │   ├── layout.tsx             # Root layout + fonts
│   │   └── globals.css            # Neon dark theme
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx       # Main layout wrapper
│   │   │   └── BottomNav.tsx      # Instagram-style bottom nav
│   │   ├── feed/
│   │   │   ├── ProviderCard.tsx   # Provider display card
│   │   │   └── RequestCard.tsx    # Request display card
│   │   └── ui/
│   │       ├── LoadingScreen.tsx  # Splash screen
│   │       └── SkeletonCard.tsx   # Loading skeleton
│   ├── lib/
│   │   ├── firebase.ts            # Firebase init
│   │   ├── auth-context.tsx       # Auth provider + OTP logic
│   │   ├── firestore.ts           # DB queries + distance calc
│   │   └── utils.ts               # cn() helper
│   ├── hooks/
│   │   └── useLocation.ts         # Geolocation hook
│   └── types/
│       └── index.ts               # TypeScript types + categories
├── firestore.rules                # Security rules
├── .env.example                   # Environment template
└── vercel.json                    # Vercel config
```

---

## ⚡ Deployment Steps

### 1. Clone & Install

```bash
git clone <your-repo>
cd atoz-service-hub
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create Project**
2. Enable **Authentication** → Sign-in methods → **Phone**
3. Enable **Firestore Database** → Start in production mode
4. Enable **Storage** (for profile images)
5. Copy your config keys

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your Firebase keys in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_ADMIN_SECRET=your_strong_password
NEXT_PUBLIC_ADMIN_WHATSAPP=919876543210
```

### 4. Deploy Firestore Rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore  # select your project
firebase deploy --only firestore:rules
```

### 5. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Deploy to Vercel

```bash
npm install -g vercel
vercel
# Follow prompts, add env vars in Vercel dashboard
```

Or push to GitHub and import at [vercel.com/new](https://vercel.com/new).

---

## 🔑 Key Features

| Feature | Implementation |
|---|---|
| OTP Auth | Firebase Phone Auth + RecaptchaVerifier |
| Location Sort | Haversine formula, browser Geolocation API |
| Provider Feed | Firestore `status=approved` query, sorted by distance |
| Request Board | Open requests, WhatsApp contact |
| Provider Registration | Form → Firestore (pending) + WhatsApp to admin |
| Admin Approval | Password-protected `/admin` → approve changes status |
| Offline Demo | Falls back to sample data if Firestore is empty |

---

## 📱 Pages

| Route | Description |
|---|---|
| `/` | Redirects to `/home` or `/auth` |
| `/auth` | Phone OTP login |
| `/home` | Provider discovery feed |
| `/requests` | Service requests board |
| `/profile` | User profile |
| `/provider-register` | Become a provider form |
| `/admin` | Admin approval panel (password protected) |

---

## 🛡️ Admin Workflow

1. Provider fills registration form at `/provider-register`
2. Data saved to Firestore with `status: "pending"`
3. Admin gets WhatsApp notification with all details
4. Admin visits `/admin` → enters password → clicks **Approve**
5. Provider's status changes to `approved` + `verified: true`
6. Provider now appears in the home feed

---

## 🎨 Design System

- **Theme:** Dark neon — `#080810` background with `#00f5ff` cyan accents
- **Fonts:** Syne (display) + DM Sans (body) + JetBrains Mono (code/labels)
- **Cards:** Glassmorphism with subtle borders
- **Animations:** CSS keyframes, shimmer skeletons
- **Layout:** Mobile-first, max-width 448px, bottom navigation

---

## 📦 Adding Real Providers (Seed Data)

Run this in your browser console after logging in as admin:

```js
// Open Firebase console → Firestore → providers collection
// Add document with these fields:
{
  name: "John Plumber",
  phone: "919876543210",  // WhatsApp number
  category: "plumber",
  experience: "8 years",
  location: { lat: 19.076, lng: 72.877 },
  address: "Andheri West, Mumbai",
  priceRange: "₹300–600",
  profileImage: "",
  rating: 4.7,
  reviewCount: 42,
  status: "approved",
  verified: true,
  userId: "manual",
  createdAt: Date.now()
}
```
