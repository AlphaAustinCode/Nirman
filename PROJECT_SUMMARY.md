# GasShare - Community LPG Sharing Platform

## 🎯 Project Overview
A comprehensive web application for community-based LPG cylinder sharing during emergencies, built with React, TypeScript, and Tailwind CSS.

## ✨ Features Implemented

### 🔐 Authentication System
- **Landing Page**: Hero section with "Never Run Out of Gas Again", features showcase, how-it-works section
- **Login Page**: Phone number + OTP verification flow with loading states
- **Registration Page**: Multi-step process
  - Step 1: Phone number entry
  - Step 2: OTP verification
  - Step 3: LPG passbook validation
  - Step 4: Personal details (name, address)
  - Progress indicator showing 25%, 50%, 75%, 100%

### 📊 Dashboard
- **Overview Cards**: Trust score (circular gauge), active listings, active requests
- **Quick Actions**: Large cards for "List Cylinder" and "Find Cylinder"
- **Recent Activity**: Feed showing sent/received/pending exchanges with user details, locations, distances, and status badges
- **Trust Score Display**: Color-coded (green 80+, yellow 60-79, orange below 60)

### 🚚 Sender Page (List Cylinder)
- **Listing Form**:
  - Location input with auto-detect button
  - Availability time range picker (from/to)
  - Safety guidelines panel
- **Active Listings**: Cards showing location, serial numbers, time slots, delete option
- **Map View**: Visual representation of nearby requests within 3km radius
- **Confirmation Dialog**: Review details before publishing

### 🔍 Receiver Page (Find Cylinder)
- **Urgency Selector**: Radio buttons for Low/Medium/High with color coding
- **Search Bar**: Location search with 3km radius indicator
- **Map View**: Interactive map showing available senders with distance markers
- **Sender Cards**: Display trust scores, star ratings, distance, availability, exchanges count
- **Request Dialog**: Confirmation modal with sender details, urgency level, and next steps

### 📜 History Page
- **Statistics Cards**: Total exchanges, completed, pending, average rating
- **Trust Score Chart**: Line graph showing score progression over 6 months using Recharts
- **Transaction List**: 
  - Tabbed interface (All/Received/Sent)
  - Filter by status (All/Completed/Pending/Cancelled)
  - Cards showing user, location, date, serial numbers, last purchase date
- **Rating System**: 5-star rating dialog with review textarea for completed transactions

### 🎨 Design System
- **Colors**: 
  - Primary Orange: #FF6B35
  - Yellow: #FFC857
  - Green: #4CAF50
  - Gradient backgrounds with soft pastels
- **Components**: Rounded corners (0.875rem), subtle shadows, glassmorphism effects
- **Typography**: Clean, readable fonts with proper hierarchy
- **Responsive**: Mobile-first with bottom navigation on mobile, sidebar on desktop

### 🧭 Navigation
- **Desktop**: Fixed sidebar with brand logo and navigation links
- **Mobile**: Bottom navigation bar with icons
- **Top Bar**: Notification bell with badge, user profile dropdown

### 🔔 Notifications
- Toast notifications for actions (Sonner)
- Badge indicator showing unread count
- Real-time feedback for all user actions

### 🛡️ Trust & Safety
- Verified user badges
- Trust score system (0-100)
- Safety guidelines in listing forms
- User ratings and reviews
- Transaction history tracking with serial numbers

## 📱 Pages Structure
```
/                    → Landing Page
/login              → Login with OTP
/register           → Multi-step Registration
/app                → Dashboard Layout
  /app              → Dashboard
  /app/send         → Sender Page
  /app/receive      → Receiver Page
  /app/history      → History Page
```

## 🎯 Key User Flows

1. **New User**: Landing → Register (Phone → OTP → Passbook → Details) → Dashboard
2. **Share Cylinder**: Dashboard → Send → Fill Form → Publish Listing
3. **Request Cylinder**: Dashboard → Receive → Select Urgency → Search → View Map/List → Request → Confirm
4. **View History**: Dashboard → History → Filter/Tab → Rate Transaction

## 🔧 Technical Stack
- React 18.3.1 with TypeScript
- React Router 7 (Data mode)
- Tailwind CSS v4
- Recharts for data visualization
- Shadcn/ui components
- Motion for animations
- Sonner for toast notifications

## 🎨 Design Highlights
- Warm, trustworthy color palette
- Gradient CTAs and important elements
- Consistent 14px border radius
- Mobile-responsive layouts
- Skeleton loaders for better UX
- Empty states with helpful messages
- Clear status indicators and badges
- Visual trust score representations

## 📊 Mock Data Included
- Sample transactions (sent/received)
- Trust score progression data
- Available senders with ratings
- Recent activity feed
- Cylinder serial numbers
- Last purchase dates

## 🚀 Ready for Enhancement
- Backend integration (Supabase ready)
- Real-time notifications
- Actual map integration (Google Maps)
- Chat functionality
- Multi-language support (Hindi/English)
- Dark mode
- Advanced filtering and search
