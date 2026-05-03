import '../styles/components.css';

export default function WorkoutItem({ icon, wClass, name, meta, calories }) {
  return (
    <div className="workout-item">
      <div className={`w-icon ${wClass}`}>{icon}</div>
      <div className="w-info">
        <div className="w-name">{name}</div>
        <div className="w-meta">{meta}</div>
      </div>
      <div className="w-cal">{calories}</div>
    </div>
  );
}