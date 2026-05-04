import { useState } from 'react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import WorkoutCard from '../components/WorkoutCard';
import '../styles/workouts.css';
import '../styles/home.css'; // for stats-row

const filterTypes = [
  { label: 'All', icon: '' },
  { label: 'Running', icon: '🏃' },
  { label: 'Cycling', icon: '🚴' },
  { label: 'Yoga', icon: '🧘' },
  { label: 'Swimming', icon: '🏊' },
  { label: 'Gym', icon: '🏋️' },
];

const workouts = [
  { icon: '🧘', wClass: 'w1', name: 'Morning Yoga', date: 'Today, 07:00', duration: 30, durUnit: 'min', calories: 120, calUnit: 'kcal', bpm: 95, status: 'Done', barWidth: 45, barColor: 'var(--sage)' },
  { icon: '🚴', wClass: 'w2', name: 'Cycling', date: 'Today, 17:30', duration: 45, durUnit: 'min', calories: 360, calUnit: 'kcal', bpm: 138, status: 'Done', barWidth: 72, barColor: 'var(--amber)' },
  { icon: '🏃', wClass: 'w3', name: 'Evening Run', date: 'Yesterday', duration: 25, durUnit: 'min', calories: 210, calUnit: 'kcal', bpm: 152, status: 'Done', barWidth: 85, barColor: 'var(--coral)' },
  { icon: '🏊', wClass: 'w4', name: 'Swimming', date: 'Mon 28 Apr', duration: 60, durUnit: 'min', calories: 450, calUnit: 'kcal', bpm: 126, status: 'Done', barWidth: 60, barColor: 'var(--sky)' },
];

export default function WorkoutsPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="page">
      <Topbar subtitle="Track your activity" title="🏋️ Workouts" streak="12" />
      
      <div className="stats-row col4">
        <StatCard icon="🗓️" value="18" label="This month" delta="▲ +3 vs last month" deltaClass="up" colorClass="c1" />
        <StatCard icon="⏱️" value="24" unit="h" label="Total duration" delta="▲ 8h more" deltaClass="up" colorClass="c2" />
        <StatCard icon="🔥" value="6,240" unit="kcal" label="Total burned" delta="▲ Personal best" deltaClass="up" colorClass="c3" />
        <StatCard icon="⚡" value="3" label="This week" delta="Goal: 5 / week" colorClass="c4" />
      </div>

      <div className="workout-filters">
        {filterTypes.map((f) => (
          <button key={f.label} className={`filter-btn ${activeFilter === f.label ? 'on' : ''}`}
            onClick={() => setActiveFilter(f.label)}>
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        <div className="workout-grid">
          {workouts.map((w, idx) => (
            <WorkoutCard key={idx} {...w} />
          ))}
        </div>
        <div className="add-workout-panel">
          <div className="add-workout-title">＋ Log a new workout</div>
          <div className="form-group">
            <label className="form-label">Exercise type</label>
            <select className="form-input form-select">
              <option>🏃 Running</option>
              <option>🚴 Cycling</option>
              <option>🧘 Yoga</option>
              <option>🏊 Swimming</option>
              <option>🏋️ Gym</option>
              <option>🚶 Walking</option>
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input className="form-input" type="number" defaultValue={45} />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" defaultValue="2026-04-29" />
            </div>
          </div>
          <div className="calorie-preview">
            <div>
              <div className="cal-label">Estimated calories burned</div>
              <div className="cal-val">360 kcal</div>
            </div>
            <div style={{ fontSize: 32 }}>🔥</div>
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save workout</button>
            <button className="btn-outline">Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}