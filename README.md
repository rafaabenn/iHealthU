# iHealthU 🌿

A personal wellness dashboard for tracking workouts, water intake, mood, BMI, calories, and weekly progress — all in one place.

---

## Features

- **Dashboard** — Daily overview of calories burned, steps, water intake, sleep target, and today's workouts
- **Workouts** — Log, edit, and delete exercise sessions with type, duration, calories, and notes
- **Water Intake** — Track daily hydration glass by glass
- **Mood Logger** — Record how you feel each day with optional notes and a weekly mood chart
- **BMI Calculator** — Slider-based calculator with healthy range, ideal weight, and personalized advice
- **Calorie Estimator** — MET-based calorie burn estimator by exercise type, duration, and body weight
- **Daily Goals** — Set personal targets for weight, calories, workouts, water, steps, and sleep
- **Weekly Summary** — 7-day calorie trend chart, total workouts, active time, and wellness insights
- **Authentication** — Register and login with JWT-based auth; all data is scoped per user

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | CSS Modules + global CSS variables |
| HTTP client | Axios (with JWT interceptor) |
| Backend | NestJS 11 (Node.js) |
| Auth | JWT (`jsonwebtoken`) |
| Data storage | JSON flat files (`/data/*.json`) |

---

## Project Structure

```
ihealthu/
├── ihealthu-frontend/
│   └── src/
│       ├── pages/          # One file per route (Dashboard, Activities, Goals…)
│       ├── components/     # Sidebar, DashboardLayout, ProtectedRoute
│       ├── context/        # AuthContext (login, register, logout)
│       ├── services/       # Axios instance with JWT interceptor
│       ├── styles/         # CSS Modules + global styles
│       └── utils/          # BMI calculator, calorie estimator, constants
│
└── ihealthu-backend/
    └── src/
        ├── auth/           # Register, login, JWT guard, user-id decorator
        ├── activities/     # CRUD for workout sessions
        ├── health/         # Health log entries (weight, BP, heart rate)
        ├── goals/          # Per-user goal settings
        └── dashboard/      # Aggregated today + weekly summary endpoints
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### 1. Clone the repo

```bash
git clone https://github.com/rafaabenn/ihealthu.git
cd ihealthu
```

### 2. Start the backend

```bash
cd ihealthu-backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### 3. Start the frontend

```bash
cd ihealthu-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

All routes except `/auth/*` require a `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive a JWT |
| GET | `/activities` | Get all workouts for the current user |
| POST | `/activities` | Add a new workout |
| PUT | `/activities/:id` | Update a workout |
| DELETE | `/activities/:id` | Delete a workout |
| GET | `/goals` | Get current user's goals |
| PUT | `/goals` | Save/update goals |
| GET | `/health` | Get health log entries |
| POST | `/health` | Add a health log entry |
| DELETE | `/health/:id` | Delete a health log entry |
| GET | `/dashboard/today` | Today's stats and workouts |
| GET | `/dashboard/summary` | 7-day summary and charts |

---

## Environment Variables

Create a `.env` file inside `ihealthu-backend/` if you want to override defaults:

```env
PORT=3000
JWT_SECRET=your-long-random-secret-here
```

The frontend reads the API base URL from an optional `.env` file in `ihealthu-frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

---

## Data Storage

This project uses JSON files as a lightweight database, stored in `ihealthu-backend/data/`:

| File | Contents |
|---|---|
| `users.json` | Registered user accounts |
| `activities.json` | All workout entries (tagged by `userId`) |
| `health.json` | Health log entries (tagged by `userId`) |
| `goals.json` | Per-user goal settings keyed by `userId` |

> **Note:** These files are committed for demo purposes. In a production environment you would replace this layer with a real database (PostgreSQL, MongoDB, etc.) and add the `data/` directory to `.gitignore`.

---

## Test Accounts

Two accounts are available out of the box for testing:

| Email | Password |
|---|---|
| demo@ihealthu.com | password123 |
| test@test.com | 123456 |

---

## Known Limitations

- No password hashing — passwords are stored in plain text (fine for a demo, not for production)
- JSON file storage has no concurrency protection
- Steps tracking is a placeholder (always shows 0) — would require device/wearable integration
- Water and mood data resets on page refresh (stored in local React state only, not persisted to backend yet)
  (We're still working on these details)


---

## License

MIT
