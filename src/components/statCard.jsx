import '../styles/components.css';

export default function StatCard({ icon, value, unit, label, delta, deltaClass, colorClass }) {
  return (
    <div className={`stat-card ${colorClass || ''}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-val">
        {value}
        {unit && <sup> {unit}</sup>}
      </div>
      <div className="stat-label">{label}</div>
      {delta && <div className={`stat-delta ${deltaClass || ''}`}>{delta}</div>}
    </div>
  );
}