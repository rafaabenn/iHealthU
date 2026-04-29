import '../styles/components.css';

export default function BmiArc({ bmi = 22.4, category = 'Normal' }) {
  // hardcoded position based on bmi (simple)
  const offset = Math.min(Math.max((bmi - 10) / 30 * 198, 0), 198);
  const cx = 12, cy = 80, r = 63;
  // approximate position for circle
  const angle = ((bmi - 10) / 30) * 180; // 0-180
  const rad = (angle * Math.PI) / 180;
  const circleX = 75 + 63 * Math.cos(rad - Math.PI); // centre 75,80
  const circleY = 80 + 63 * Math.sin(rad - Math.PI);
  const left = (bmi - 10) / 30 * 100; // percentage for marker

  return (
    <div className="bmi-arc-wrap">
      <svg width="150" height="86" viewBox="0 0 150 86" style={{ overflow: 'visible' }}>
        <path d="M 12 80 A 63 63 0 0 1 138 80" fill="none" stroke="#EEE" strokeWidth="11" strokeLinecap="round" />
        <path d="M 12 80 A 63 63 0 0 1 138 80" fill="none" stroke="#A8D5C2" strokeWidth="11" strokeLinecap="round"
          strokeDasharray="198" strokeDashoffset={198 - offset} />
        <circle cx="104" cy="30" r="7" fill="#1C4A3E" stroke="#FDFCF8" strokeWidth="2.5" />
      </svg>
      <div className="bmi-center">
        <div className="bmi-big">{bmi}</div>
        <div className="bmi-cat">{category}</div>
      </div>
      <div className="bmi-footer">
        <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span>
      </div>
    </div>
  );
}