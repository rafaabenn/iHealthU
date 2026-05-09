import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
//afficher une structure commune pour toutes les pages du dashboard.
export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--bg)',
        padding: '26px 30px',
      }}>
        <Outlet />
      </main>
    </div>
  )
}