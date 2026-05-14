# 🌿 iHealthU — Your Personal Wellness Companion

iHealthU is a modern, premium wellness tracking application designed to help users monitor their physical and mental health. From activity logging and calorie tracking to mood journaling and hydration monitoring, iHealthU provides a holistic view of your daily well-being.

---

## ✨ Key Features

### 📊 Comprehensive Dashboard
*   **Real-time Metrics**: Track active minutes, calories burned, water intake, and sleep duration at a glance.
*   **Daily Progress**: Visual progress bars help you stay on top of your daily health goals.
*   **Activity Feed**: Quick view of your most recent workouts.
*   **Smart Meal Suggestions**: Personalized meal ideas with ingredients and preparation steps.

### 🏃‍♂️ Activity & Workout Tracking
*   **Detailed Logging**: Log various workout types (Running, Cycling, Swimming, HIIT, etc.).
*   **Auto-Calculation**: Calories are automatically estimated based on workout intensity (MET) and your personal profile weight.
*   **History View**: Navigate through past weeks to review your consistency and progress.

### 💧 Hydration Monitor
*   **Interactive Glass Logging**: Click to log water intake in 0.2L increments.
*   **Dynamic Goals**: Set and reach personalized daily hydration targets.
*   **Wellness Tips**: Stay informed with expert hydration advice.

### 🌙 Sleep Analysis
*   **Bedtime Tracking**: Log your actual sleep and wake times.
*   **Duration Trends**: Monitor your sleep quality and ensure you're getting the recovery you need.

### 🧠 Mood Journaling
*   **Emotional Check-in**: Track your daily mood with intuitive emojis.
*   **Journaling**: Add notes to your mood logs to identify patterns in your well-being.
*   **Mood History**: View a 7-day snapshot of your emotional trends.

### 📈 Weekly Performance Review
*   **Data Visualization**: Interactive charts (powered by Recharts) showing trends in calories, water, sleep, and activity.
*   **Performance Insights**: Discover your "Best Day" and weekly averages for key metrics.

---

## 🛠️ Technology Stack

### Frontend
*   **React 19**: Modern UI library for building dynamic interfaces.
*   **Vite**: Lightning-fast build tool and development server.
*   **Recharts**: Composable charting library for data visualization.
*   **Lucide & Phosphor Icons**: Premium icon sets for a modern aesthetic.
*   **CSS Modules**: Component-scoped styling for clean and maintainable code.

### Backend
*   **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
*   **JWT Authentication**: Secure user login and protected API routes.
*   **File-based JSON DB**: Simple, lightweight data persistence for easy demonstration and portability.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/rafaabenn/iHealthU.git
    cd iHealthU
    ```

2.  **Setup Backend**
    ```bash
    cd ihealthu-backend
    npm install
    npm run start:dev
    ```

3.  **Setup Frontend**
    ```bash
    cd ../ihealthu-frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```text
iHealthU/
├── ihealthu-backend/      # NestJS Backend
│   ├── src/               # Source code (Auth, Activities, Goals, Mood, Sleep)
│   ├── data/              # JSON "database" files
│   └── test/              # E2E tests
├── ihealthu-frontend/     # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API integration
│   │   ├── utils/         # Helper functions (BMI, etc.)
│   │   └── styles/        # CSS Modules and Global styles
│   └── public/            # Static assets (logos, images)
└── README.md              # Project documentation
```

---

## 👥 Meet the Team

*   **GHAMMAD Aya**
*   **BENNOUR Rafaa** 
*   **RIAD Marwa**
*   **AMANZOU Amal**

---

© 2026 iHealthU. All rights reserved.
