import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import HealthMetrics from './pages/HealthMetrics'
import Goals from './pages/Goals'

// Placeholder pages for remaining routes
const PlaceholderPage = ({ title, icon }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>iHealthU</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>
        {icon} <span style={{ color: 'var(--sage)' }}>{title}</span>
      </h1>
    </div>
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '40px 30px', textAlign: 'center',
      color: 'var(--text2)', fontSize: 14
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <p>This page is under construction. Full CRUD coming soon!</p>
    </div>
  </div>
)

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
            <Route path="health" element={<HealthMetrics />} />
            <Route path="goals" element={<Goals />} />
            <Route path="water" element={<PlaceholderPage title="Water tracker" icon="💧" />} />
            <Route path="mood" element={<PlaceholderPage title="Mood tracker" icon="😊" />} />
            <Route path="bmi" element={<PlaceholderPage title="BMI Calculator" icon="⚖️" />} />
            <Route path="calories" element={<PlaceholderPage title="Calorie Tracker" icon="🔥" />} />
            <Route path="summary" element={<PlaceholderPage title="Weekly Summary" icon="📊" />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}