import '../styles/components.css';

export default function GoalItem({ name, pct, width, fillClass }) {
  return (
    <div className="goal-item">
      <div className="goal-header">
        <span className="goal-name">{name}</span>
        <span className="goal-pct">{pct}</span>
      </div>
      <div className="goal-bar">
        <div className={`goal-fill ${fillClass}`} style={{ width: width }} />
      </div>
    </div>
  );
}