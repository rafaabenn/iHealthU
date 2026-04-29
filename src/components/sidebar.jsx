import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Home', icon: '🏠', path: '/' },
      // Weekly summary removed
    ],
  },
  {
    label: 'Track',
    items: [
      { label: 'Workouts', icon: '🏋️', path: '/workouts', badge: '3' },
      { label: 'Water intake', icon: '💧', path: '/water' },
      { label: 'Mood logger', icon: '😊', path: '/mood' },
      // Health metrics removed
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'BMI Calculator', icon: '⚖️', path: '/bmi' },
      { label: 'Calorie estimator', icon: '🔥', path: '/calories' },
      { label: 'Daily goals', icon: '🎯', path: '/goals' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', icon: '⚙️', path: '/' },
      { label: 'Logout', icon: '🚪', path: '/' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">i<span>Health</span>U</div>
        <div className="logo-sub">Your daily wellness companion</div>
      </div>
      <nav className="nav-section">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="nav-label">{section.label}</div>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">SA</div>
          <div>
            <div className="user-name">Sara A.</div>
            <div className="user-role">Member since 2026</div>
          </div>
        </div>
      </div>
    </aside>
  );
}