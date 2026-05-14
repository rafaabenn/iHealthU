import { useState, useEffect } from 'react'
import api from '../services/api'
import '../styles/water.css'
import { Drop, Clock, ForkKnife, Barbell } from '@phosphor-icons/react'

const TIPS = [
  { Icon: Clock,     title: 'Morning routine', text: 'Drink a glass right after waking up to kickstart hydration' },
  { Icon: ForkKnife, title: 'Before meals',    text: 'Drinking before meals helps digestion and reduces appetite' },
  { Icon: Barbell,   title: 'During workouts', text: 'Drink 200–300 mL every 20 minutes of intense exercise' },
]

export default function WaterPage() {
  const [filled, setFilled]   = useState(0)
  const [total, setTotal]     = useState(2.0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWater()
  }, [])

  const fetchWater = async () => {
    try {
      const res = await api.get('/dashboard/today')
      if (res.data) {
        setTotal(res.data.dailyWaterGoal || 2.0)
        setFilled(Math.round((res.data.water || 0) / 0.2))
      }
    } catch (err) {
      console.error('Failed to fetch water data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGlassClick = async (i) => {
    const newFilled = i < filled ? i : i + 1
    setFilled(newFilled)
    const amount = Math.round(newFilled * 0.2 * 100) / 100
    try {
      await api.put('/dashboard/water', { amount })
    } catch (err) {
      console.error('Failed to save water intake', err)
    }
  }

  const currentLiters = filled * 0.2
  const percentage    = Math.min(Math.round((currentLiters / total) * 100), 100)
  const liters        = currentLiters.toFixed(1)
  const goalLiters    = total.toFixed(1)
  const glassesGoal   = Math.round(total / 0.2)

  // Dynamic sizing refined for "single line" feel
  let cols = glassesGoal;
  let glassHeight = 42;
  let iconSize = 18;
  let fontSize = 16;

  if (glassesGoal > 12) {
    cols = 10; // Max 10 per row for larger goals
    glassHeight = 36;
    iconSize = 16;
    fontSize = 14;
  }

  if (glassesGoal > 25) {
    cols = 12; // Even more columns for very large goals
    glassHeight = 32;
    iconSize = 14;
    fontSize = 12;
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
          <h1 className="page-title">
            <Drop size={26} weight="duotone" color="var(--sky)" style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Water <span>Intake</span>
          </h1>
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
            Goal: {goalLiters} L ({glassesGoal} glasses)
          </div>
        </div>

        <div style={{ width: '100%', marginTop: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Tap to log 0.2L</div>
          <div className="glass-grid">
            {Array.from({ length: glassesGoal }, (_, i) => (
              <div
                key={i}
                className={`glass-lg ${i < filled ? 'filled' : ''}`}
                style={{ 
                  height: glassHeight, 
                  fontSize: fontSize,
                  flex: `0 0 calc((100% - ${(cols - 1) * 8}px) / ${cols})`
                }}
                onClick={() => handleGlassClick(i)}
              >
                {i < filled
                  ? <Drop size={iconSize} weight="duotone" color="#6BA8C4" />
                  : <span style={{ opacity: 0.6 }}>+</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="water-tips">
        {TIPS.map((tip, i) => (
          <div key={i} className="tip-card">
            <div className="tip-icon">
              <tip.Icon size={24} weight="duotone" color="var(--sky)" />
            </div>
            <div className="tip-title">{tip.title}</div>
            <div className="tip-text">{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}