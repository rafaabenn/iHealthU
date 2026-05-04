import Topbar from '../components/Topbar';
import '../styles/goals.css';

const goals = [
  { icon: '💧', colorClass: 'g2', title: 'Water intake', sub: 'Target: 8 glasses / day', progress: 75, target: 8, current: 6 },
  { icon: '🌙', colorClass: 'g3', title: 'Sleep duration', sub: 'Target: 8 hours / night', progress: 90, target: 8, current: 7.2 },
  { icon: '🏋️', colorClass: 'g4', title: 'Workouts per week', sub: 'Target: 5 sessions', progress: 60, target: 5, current: 3 },
];

export default function GoalsPage() {
  return (
    <div className="page">
      <Topbar subtitle="Set & track targets" title="🎯 Daily goals" />
      <div className="goals-grid">
        {goals.map((g, i) => (
          <div key={i} className="goal-card">
            <div className="goal-card-header">
              <div className={`goal-icon-big ${g.colorClass}`}>{g.icon}</div>
              <div>
                <div className="goal-card-title">{g.title}</div>
                <div className="goal-card-sub">{g.sub}</div>
              </div>
            </div>
            <input className="form-input" type="number" defaultValue={g.target} style={{ marginBottom: 10 }} />
            <div className="big-progress">
              <div
                className="big-progress-fill"
                style={{
                  width: `${g.progress}%`,
                  background: `linear-gradient(90deg, var(--sage), #6BAF9E)`, // simplified
                }}
              />
            </div>
            <div className="goal-nums">
              <span>Today: <strong>{g.current}</strong></span>
              <span>{g.progress}% complete</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}