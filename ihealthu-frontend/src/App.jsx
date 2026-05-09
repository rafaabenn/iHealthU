import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import Goals from './pages/Goals'
import WaterPage from './pages/waterPage'
import MoodPage from './pages/moodPage'
import BmiPage from './pages/BmiPage'
import CaloriesPage from './pages/caloriesPage'
import WeeklySummary from './pages/WeeklySummary'
import Profile from './pages/Profile'
import SleepPage from './pages/SleepPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="activities" element={<Activities />} />
            <Route path="goals" element={<Goals />} />
            <Route path="water" element={<WaterPage />} />
            <Route path="mood" element={<MoodPage />} />
            <Route path="bmi" element={<BmiPage />} />
            <Route path="calories" element={<CaloriesPage />} />
            <Route path="summary" element={<WeeklySummary />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sleep" element={<SleepPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}