import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Panel from '../components/Panel';
import StatCard from '../components/StatCard';
import WorkoutItem from '../components/WorkoutItem';
import GoalItem from '../components/GoalItem';
import MoodSelector from '../components/MoodSelector';
import MoodHistory from '../components/MoodHistory';
import WaterGlasses from '../components/WaterGlasses';
import QuickActions from '../components/QuickActions';
import BmiArc from '../components/BmiArc';
import { QUOTE } from '../utils/constants';
import '../styles/home.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page active">
      <Topbar subtitle="Wednesday, 29 April 2026" title='Good morning, <span>Sara</span> 👋' streak="12" />
      
      <div className="quote-banner">
        <div className="quote-leaf">🌿</div>
        <div className="quote-text"><strong>Quote of the day — </strong>{QUOTE}</div>
      </div>

      <div className="stats-row col4">
        <StatCard icon="⚖️" value="62" unit="kg" label="Current weight" delta="▼ 0.4 kg this week" deltaClass="dn" colorClass="c1" />
        <StatCard icon="👟" value="7,842" label="Steps today" delta="▲ 84% of daily goal" deltaClass="up" colorClass="c2" />
        <StatCard icon="🌙" value="7.2" unit="h" label="Sleep last night" delta="▲ Above average" deltaClass="up" colorClass="c3" />
        <StatCard icon="🔥" value="480" unit="kcal" label="Burned today" delta="▲ 2 workouts" deltaClass="up" colorClass="c4" />
      </div>

      <div className="mid-grid">
        <Panel title="Recent workouts" actionText="View all →" onAction={() => navigate('/workouts')}>
          <WorkoutItem icon="🧘" wClass="w1" name="Morning Yoga" meta="Today · 30 min" calories="120 kcal" />
          <WorkoutItem icon="🚴" wClass="w2" name="Cycling" meta="Today · 45 min" calories="360 kcal" />
          <WorkoutItem icon="🏃" wClass="w3" name="Evening Run" meta="Yesterday · 25 min" calories="210 kcal" />
        </Panel>

        <Panel title="💧 Water intake" actionText="Track →" onAction={() => navigate('/water')}>
          <WaterGlasses />
          <div className="water-progress-bar">
            <div className="water-fill" style={{ width: '75%' }} />
          </div>
          <div className="water-label">
            <span>6 / 8 glasses</span>
            <span style={{ color: 'var(--sky)', fontWeight: 600 }}>500 mL left</span>
          </div>
        </Panel>
      </div>

      <div className="bottom-grid">
        <Panel title="🎯 Daily goals" actionText="Edit" onAction={() => navigate('/goals')}>
          <GoalItem name="Steps" pct="78%" width="78%" fillClass="gf1" />
          <GoalItem name="Water" pct="75%" width="75%" fillClass="gf2" />
          <GoalItem name="Sleep" pct="90%" width="90%" fillClass="gf3" />
          <GoalItem name="Workouts / week" pct="3 / 5" width="60%" fillClass="gf4" />
        </Panel>

        <Panel title="😊 Today's mood" actionText="Log →" onAction={() => navigate('/mood')}>
          <MoodSelector />
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>This week</div>
          <MoodHistory />
        </Panel>

        <Panel title="⚖️ BMI" actionText="Details →" onAction={() => navigate('/bmi')}>
          <BmiArc />
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text2)', marginTop: 8 }}>
            Healthy range: <strong style={{ color: 'var(--forest)' }}>51.5–69.3 kg</strong>
          </div>
        </Panel>
      </div>

      <QuickActions onAction={(path) => navigate(path)} />
    </div>
  );
}