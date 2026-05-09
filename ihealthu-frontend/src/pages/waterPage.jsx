import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/water.css'

const ML_PER_GLASS = 250

const TIPS = [
  { icon: '⏰', title: 'Morning routine', text: 'Drink a glass right after waking up to kickstart hydration' },
  { icon: '🥤', title: 'Before meals',    text: 'Drinking before meals helps digestion and reduces appetite' },
  { icon: '🏋️', title: 'During workouts', text: 'Drink 200–300 mL every 20 minutes of intense exercise' },
]

const DEFAULT_GLASSES = 8

export default function WaterPage() {
  const [filled, setFilled]   = useState(0)
  const [total, setTotal]     = useState(DEFAULT_GLASSES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/goals'),
      api.get('/daily/today'),
    ])
      .then(([goalsRes, dailyRes]) => {
        if (goalsRes.data?.dailyWater) setTotal(Number(goalsRes.data.dailyWater))
        if (dailyRes.data?.water)      setFilled(Number(dailyRes.data.water))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const percentage = Math.round((filled / total) * 100)
  const liters     = ((filled * ML_PER_GLASS) / 1000).toFixed(1)
  const goalLiters = ((total  * ML_PER_GLASS) / 1000).toFixed(1)

  const handleGlassClick = (i) => {
    const newFilled = i < filled ? i : i + 1
    setFilled(newFilled)
    api.post('/daily/today', { water: newFilled }).catch(console.error)
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ opacity: 0.5, fontSize: 14 }}>Loading your goal…</div>
      </div>
    )
  }

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
          style={{
            background: `conic-gradient(rgba(255,255,255,0.9) ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)`,
          }}
        >
          <div className="water-ring-text">
            <div className="water-ring-pct">{percentage}%</div>
            <div className="water-ring-label">of daily goal</div>
          </div>
        </div>

        <div style={{ marginTop: -10 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>Today you've had</div>
          <div className="water-hero-val">{liters} L</div>
          <div className="water-hero-sub">
            Goal: {goalLiters} L ({total} glasses)
          </div>
        </div>

        <div style={{ width: '100%', marginTop: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Tap to log a glass</div>
          <div className="glass-grid">
            {Array.from({ length: total }, (_, i) => (
              <div
                key={i}
                className={`glass-lg ${i < filled ? 'filled' : ''}`}
                onClick={() => handleGlassClick(i)}
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