import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Sidebar.module.css'

const navItems = [
  {
    section: 'OVERVIEW', items: [
      { to: '/dashboard', icon: '🏠', label: 'Home' },
      { to: '/dashboard/activities', icon: '🏃', label: 'Activities', badge: null },
      { to: '/dashboard/water', icon: '💧', label: 'Water' },
      { to: '/dashboard/sleep', icon: '🌙', label: 'Sleep' },
      { to: '/dashboard/mood', icon: '😊', label: 'Mood' },
    ]
  },
  {
    section: 'GOALS', items: [
      { to: '/dashboard/goals', icon: '🎯', label: 'Daily goals' },
      { to: '/dashboard/summary', icon: '📊', label: 'Weekly summary' },
    ]
  },
  {
    section: 'ACCOUNT', items: [
      { to: '/dashboard/profile', icon: '👤', label: 'My Profile' },
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
          <img src="public/image.png" alt="logo" style={{ width: '35px', height: '35px' ,margin:'5px'}} />
          iHealth<span>U</span>
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
            ⎋
          </button>
        </div>
      </div>
    </aside>
  )
}
