import '../styles/components.css';

// heights are percentages; todayIndex is the index of today's bar (0‑6)
export default function MoodHistory({ heights = [50, 70, 40, 65, 80, 55, 75], todayIndex = 6 }) {
  return (
    <div className="mood-history">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`mbar ${i === todayIndex ? 'today' : ''}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}