import { useState } from 'react';
import Topbar from '../components/Topbar';
import { TIPS } from '../utils/constants';
import '../styles/water.css';

export default function WaterPage() {
  const [filled, setFilled] = useState(6);
  const total = 8;
  const percentage = Math.round((filled / total) * 100);

  return (
    <div className="page">
      <Topbar subtitle="Stay hydrated" title="💧 Water intake" />
      <div className="water-hero">
        <div className="water-ring" style={{ background: `conic-gradient(rgba(255,255,255,0.9) ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)` }}>
          <div className="water-ring-text">
            <div className="water-ring-pct">{percentage}%</div>
            <div className="water-ring-label">of daily goal</div>
          </div>
        </div>
        <div style={{ marginTop: -10 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Today you've had</div>
          <div className="water-hero-val">{(filled * 0.25).toFixed(1)} L</div>
          <div className="water-hero-sub">Goal: 2.0 L (8 glasses)</div>
        </div>
        <div style={{ width: '100%', marginTop: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Tap to log a glass</div>
          <div className="glass-grid">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className={`glass-lg ${i < filled ? 'filled' : ''}`}
                onClick={() => setFilled(i < filled ? i : i + 1)}
              >
                {i < filled ? '💧' : '+'}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="water-tips">
        {TIPS.map((tip, i) => (
          <div key={i} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-title">{tip.title}</div>
            <div className="tip-text">{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}