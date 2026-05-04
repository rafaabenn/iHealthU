import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import Panel from '../components/Panel';
import WorkoutItem from '../components/WorkoutItem';
import { estimateCalories } from '../utils/calorieEstimate';
import '../styles/calories.css';

export default function CaloriesPage() {
  const [met, setMet] = useState(7); // running default
  const [duration, setDuration] = useState(45);
  const [weight, setWeight] = useState(62);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    setCalories(estimateCalories(met, duration, weight));
  }, [met, duration, weight]);

  return (
    <div className="page">
      <Topbar subtitle="Energy expenditure" title="🔥 Calorie estimator" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Panel title="Estimate calories burned">
          <div className="form-group">
            <label className="form-label">Exercise type</label>
            <select className="form-input form-select" value={met} onChange={e => setMet(Number(e.target.value))}>
              <option value={4}>🚶 Walking</option>
              <option value={7}>🏃 Running</option>
              <option value={8}>🚴 Cycling</option>
              <option value={6}>🧘 Yoga</option>
              <option value={9}>🏊 Swimming</option>
              <option value={10}>🏋️ HIIT</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input className="form-input" type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label className="form-label">Body weight (kg)</label>
            <input className="form-input" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} />
          </div>
          <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--sage))', borderRadius: 16, padding: 20, textAlign: 'center', marginTop: 8 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Estimated calories burned</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: '#fff', letterSpacing: -2 }}>{calories}</div>
            <div style={{ fontSize: 13, color: 'var(--mint)' }}>kcal in {duration} minutes</div>
          </div>
        </Panel>

        <Panel title="Today's total">
          <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--coral)', letterSpacing: -2 }}>480</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>kcal burned today</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text2)' }}>Today's workouts</div>
          <WorkoutItem icon="🧘" wClass="w1" name="Yoga · 30 min" calories="120 kcal" />
          <WorkoutItem icon="🚴" wClass="w2" name="Cycling · 45 min" calories="360 kcal" />
          <div style={{ marginTop: 14, padding: 12, background: 'var(--bg)', borderRadius: 12, fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
            💡 Based on the MET formula: Calories = MET × weight (kg) × duration (h)
          </div>
        </Panel>
      </div>
    </div>
  );
}