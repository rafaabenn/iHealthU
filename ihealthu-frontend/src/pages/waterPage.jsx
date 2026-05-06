import { useState } from 'react'
import '../styles/water.css'

const TIPS = [
  { icon: '⏰', title: 'Morning routine', text: 'Drink a glass right after waking up to kickstart hydration' },
  { icon: '🥤', title: 'Before meals', text: 'Drinking before meals helps digestion and reduces appetite' },
  { icon: '🏋️', title: 'During workouts', text: 'Drink 200–300 mL every 20 minutes of intense exercise' },
]

export default function WaterPage() {
  const [filled, setFilled] = useState(0)
  const total = 8
  const percentage = Math.round((filled / total) * 100)

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Stay hydrated</div>
          <h1 className="page-title">💧 Water <span>Intake</span></h1>
        </div>
      </div>

      <div className="water-hero">
        <div
          className="water-ring"
          style={{ background: `conic-gradient(rgba(255,255,255,0.9) ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)` }}
        >
          <div className="water-ring-text">
            <div className="water-ring-pct">{percentage}%</div>
            <div className="water-ring-label">of daily goal</div>
          </div>
        </div>
        <div style={{ marginTop: -10 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Today you've had</div>
          <div className="water-hero-val">{(filled * 0.25).toFixed(1)} L</div>
          <div className="water-hero-sub">Goal: 2.0 L ({total} glasses)</div>
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
  )
}