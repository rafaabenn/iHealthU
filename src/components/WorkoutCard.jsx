import '../styles/workouts.css';

export default function WorkoutCard({ icon, wClass, name, date, duration, durUnit, calories, calUnit, bpm, status, barWidth, barColor }) {
  return (
    <div className="workout-card">
      <div className="wc-top">
        <div className="wc-icon-wrap">
          <div className={`wc-icon ${wClass}`}>{icon}</div>
          <div>
            <div className="wc-name">{name}</div>
            <div className="wc-date">{date}</div>
          </div>
        </div>
        <span className={`tag tag-${status === 'Done' ? 'green' : 'orange'}`}>{status}</span>
      </div>
      <div className="wc-stats">
        <div className="wcs">
          <div className="wcs-val">{duration}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text2)' }}> {durUnit}</span></div>
          <div className="wcs-label">Duration</div>
        </div>
        <div className="wcs">
          <div className="wcs-val">{calories}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text2)' }}> {calUnit}</span></div>
          <div className="wcs-label">Burned</div>
        </div>
        <div className="wcs">
          <div className="wcs-val">♥ {bpm}</div>
          <div className="wcs-label">Avg BPM</div>
        </div>
      </div>
      <div className="wc-bar">
        <div className="wc-bar-fill" style={{ width: `${barWidth}%`, background: barColor }} />
      </div>
    </div>
  );
}