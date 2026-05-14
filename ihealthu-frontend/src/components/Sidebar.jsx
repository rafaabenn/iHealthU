import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Sidebar.module.css'
import {
  Home, Dumbbell, Droplets, Moon, Smile,
  Scale, Flame, Target, BarChart2, User, LogOut
} from 'lucide-react'

const navItems = [
  {
    section: 'OVERVIEW', items: [

      { to: '/dashboard', icon: <Home size={16} />, label: 'Home' },
      { to: '/dashboard/activities', icon: <Dumbbell size={16} />, label: 'Workouts' },
      { to: '/dashboard/water', icon: <Droplets size={16} />, label: 'Water' },
      { to: '/dashboard/sleep', icon: <Moon size={16} />, label: 'Sleep' },
      { to: '/dashboard/mood', icon: <Smile size={16} />, label: 'Mood' },
    ]
  },
  {
    section: 'GOALS', items: [
      { to: '/dashboard/goals', icon: <Target size={16} />, label: 'Daily goals' },
      { to: '/dashboard/summary', icon: <BarChart2 size={16} />, label: 'Weekly summary' },
    ]
  },
  {
    section: 'ACCOUNT', items: [
      { to: '/dashboard/profile', icon: <User size={16} />, label: 'My Profile' },
    ]
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <img src="/white.png" alt="logo" style={{ width: '35px', height: '35px', margin: '5px' }} />
          <span>i</span>Health<span>U</span>
        </div>
        <div className={styles.logoSub}>Your wellness companion</div>
      </div>

      <nav className={styles.navSection}>
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className={styles.navLabel}>{section}</div>
            {items.map(({ to, icon, label, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{icon}</span>
                {label}
                {badge && <span className={styles.navBadge}>{badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userChip}>
          <img
            src={user?.avatar || 'https://api.dicebear.com/9.x/micah/svg?seed=Adrian'}
            alt="Avatar"
            className={styles.avatar}
            style={{ objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div className={styles.userName}>{user?.name || 'User'}</div>
            <div className={styles.userRole}>{user?.email || ''}</div>
          </div>
          <button
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
