# TelcomFix 📡

**CodeArena'26 Hackathon Project** — Detecting & Fixing Mobile Service Problems at Scale

## Overview
A full-stack telco fault management platform with AI-assisted auto-resolution, built for detecting and fixing mobile service problems at scale.

## Architecture

```
telcom fix/
├── telcomfix-web/        # NOC + Admin web portals (Vite + React)
├── telcomfix-mobile/     # Customer + Field Engineer mobile app (Expo)
└── firestore.rules       # Firebase Firestore security rules
```

## Features

### 🌐 Web Portal (`telcomfix-web`)
| Portal | Features |
|---|---|
| **NOC Engineer** | Live Leaflet map (25 towers), real-time alarm stream, field dispatch, predictive risk scores |
| **System Admin** | AI confidence sliders, credit oversight, audit logs, analytics charts, user management |

### 📱 Mobile App (`telcomfix-mobile`)
| Role | Features |
|---|---|
| **Customer** | Issue reporting wizard, 4-stage AI ticket tracker, speed diagnostics, VAS/billing management |
| **Field Engineer** | Job queue, on-site checklist, tower map, live alarm feed, fix report submission |

## Tech Stack
- **Web**: Vite + React, React Router, Leaflet/OpenStreetMap, Recharts
- **Mobile**: Expo (React Native), React Navigation, react-native-web
- **Backend**: Firebase Auth + Firestore (real-time sync)
- **Data**: 25 simulated towers across Colombo region, live alarm simulation

## Firebase Project
- Project ID: `telcom-fix-a79d8`
- Auth: Email/Password (4 demo roles)
- Firestore: Real-time sync across all clients

## Demo Credentials
| Role | Email | Password |
|---|---|---|
| NOC Engineer | noc@telcomfix.lk | telcom2026 |
| System Admin | admin@telcomfix.lk | telcom2026 |
| Customer | customer@telcomfix.lk | telcom2026 |
| Field Engineer | engineer@telcomfix.lk | telcom2026 |

## Running Locally

### Web Portal
```bash
cd telcomfix-web
npm install
npm run dev
# → http://localhost:5173
```

### Mobile App (Expo Web)
```bash
cd telcomfix-mobile
npm install
npx expo start --web --port 19006
# → http://localhost:19006
```

## Firebase Setup (one-time)
1. Enable **Email/Password** in Firebase Console → Authentication → Sign-in method
2. Create **Firestore Database** (Production mode, region: asia-south1)
3. Deploy rules: `firebase deploy --only firestore:rules`

The app auto-seeds all mock data (towers, tickets, alarms, jobs) on first login.

---
*CodeArena'26 · TelcomFix · Built with React + Expo + Firebase*
