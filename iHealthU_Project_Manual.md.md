# iHealthU: Comprehensive Project Manual & Technical Guide

## 1. Project Overview
**iHealthU** is a premium, full-stack wellness ecosystem designed to provide users with a centralized dashboard for tracking physical activity, nutrition, sleep, and mental well-being. Built with a focus on high-end aesthetics and user-centric data visualization, the platform transforms raw health data into actionable insights through an intuitive "glassmorphic" interface.

### Vision
To empower individuals to take control of their health journey by providing a holistic view of their daily habits, gamifying progress through streaks, and offering personalized wellness recommendations.

---

## 2. Technical Architecture
The application follows a modern **Client-Server** architecture, separating the presentation layer from the business logic and data management.

### 2.1 Frontend (Presentation Layer)
- **Framework**: [React.js](https://reactjs.org/) (Version 18+)
- **Build Tool**: [Vite](https://vitejs.dev/) for ultra-fast development and optimized production builds.
- **Styling**: Vanilla **CSS Modules** for scoped, maintainable styles.
- **Design System**: 
    - **Aesthetics**: Glassmorphism, smooth gradients, and dark-mode optimization.
    - **Icons**: [Phosphor Icons](https://phosphoricons.com/) and [Lucide React](https://lucide.dev/).
    - **Interactivity**: Custom-built carousels, progress rings, and dynamic charts.

### 2.2 Backend (Service Layer)
- **Framework**: [NestJS](https://nestjs.com/) (Node.js framework) for a scalable and maintainable modular architecture.
- **API Pattern**: RESTful API design.
- **Services**: Modular logic for Activities, Goals, Sleep, and Streak management.

### 2.3 Data Persistence
- **Storage Strategy**: File-based JSON storage (Local DB).
- **Location**: `ihealthu-backend/data/`
- **Purpose**: This lightweight approach ensures rapid development and ease of portability for academic demonstrations without the overhead of a dedicated SQL/NoSQL server.

---

## 3. Core Features & Functional Modules

### 3.1 The Dynamic Dashboard
The central hub of the application provides an at-a-glance summary of the user's status.
- **Real-time Stat Cards**: High-level metrics for Steps, Calories, Water, and Sleep.
- **Daily Progress Rings**: Visual representation of goal completion using SVG-based circular progress indicators.
- **Personalized Greeting**: Time-aware greetings (Morning/Afternoon/Evening) and daily motivational quotes.

### 3.2 Activity & Workout Tracking
Allows users to log and monitor physical exercises.
- **Workout Logs**: Categorized by intensity and type.
- **Metric Integration**: Automatically syncs burned calories and active minutes to the daily totals.

### 3.3 Goal Management
A dedicated space for defining wellness targets.
- **Dynamic Targets**: Users can set personalized goals for water intake, sleep duration, and caloric burn.
- **Progress Tracking**: Real-time comparison between current metrics and set targets.

### 3.4 Sleep & Recovery Analysis
Focuses on the quality of rest.
- **Sleep Logging**: Manual entry for hours slept and wake-up times.
- **Insights**: Visualizes sleep trends against the recommended 8-hour target.

### 3.5 Weekly Summary & Analytics
A macro-view of health performance.
- **Trends**: Line and Bar charts showing performance over the last 7 days.
- **Performance Grading**: Comparative analysis of consistency and streak maintenance.

---

## 4. User Manual: How to Use iHealthU

### 4.1 Getting Started
1. **Authentication**: Use the login portal (Demo credentials: `rafaa@test.com` / `123456`).
2. **Setup**: Navigate to the **Goals** page to set your initial targets for the day.

### 4.2 Logging Data
- **Water**: Click the "Add Cup" icon on the dashboard or goals page.
- **Workouts**: Use the **Activities** page to log specific exercises.
- **Sleep**: Input your rest hours in the **Sleep** tab.

### 4.3 Navigating the UI
- **Sidebar**: Access all main modules (Dashboard, Goals, Activities, Sleep, Weekly Summary).
- **Profile Settings**: Manage user details and account preferences (accessible via the user avatar).

---

## 5. Development & Deployment Guide

### 5.1 Prerequisites
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher)

### 5.2 Local Setup
To run the application locally for a presentation:

1. **Clone the Repository**
2. **Start the Backend**:
   ```powershell
   cd ihealthu-backend
   npm install
   npm run start:dev
   ```
3. **Start the Frontend**:
   ```powershell
   cd ihealthu-frontend
   npm install
   npm run dev
   ```

### 5.3 Deployment Considerations
For production use, the following enhancements are recommended:
- **Database**: Migrating from JSON files to **PostgreSQL** or **MongoDB**.
- **Security**: Implementation of **JWT (JSON Web Tokens)** for session management.
- **Cloud Hosting**: Deploying the backend to **Heroku/AWS** and the frontend to **Vercel/Netlify**.

---

## 6. Academic Significance
iHealthU serves as a demonstration of **Modern Web Engineering** principles:
- **Full-Stack Integration**: Seamless data flow between React and NestJS.
- **UX/UI Excellence**: Applying psychological principles of "Design Delight" to improve user retention in health apps.
- **Modular Programming**: Use of Services and Controllers in the backend for clean separation of concerns.
