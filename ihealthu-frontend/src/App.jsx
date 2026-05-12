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
import Mood from './pages/Mood'
import WeeklySummary from './pages/WeeklySummary'
import Profile from './pages/Profile'
import Sleep from './pages/Sleep'

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
            <Route path="mood" element={<Mood />} />
            <Route path="summary" element={<WeeklySummary />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sleep" element={<Sleep />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}