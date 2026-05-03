import '../styles/components.css';

const actions = [
  { label: 'Log workout', icon: '🏋️', path: '/workouts' },
  { label: 'Add glass', icon: '💧', path: '/water' },
  { label: 'Est. calories', icon: '🔥', path: '/calories' },
  { label: 'Set goals', icon: '🎯', path: '/goals', outline: true },
];

export default function QuickActions({ onAction }) {
  return (
    <div className="panel" style={{ padding: '16px 20px' }}>
      <div className="panel-header" style={{ marginBottom: 12 }}>
        <div className="panel-title">Quick actions</div>
      </div>
      <div className="quick-row">
        {actions.map((act) => (
          <button
            key={act.path}
            className={`qa-btn ${act.outline ? 'outline' : ''}`}
            onClick={() => onAction(act.path)}
          >
            <span>{act.icon}</span>
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
}