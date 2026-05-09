import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import styles from '../styles/Dashboard.module.css'

const QUOTES = [
  "Every step forward is a step toward a healthier you.",
  "Small progress is still progress. Keep moving.",
  "Your body keeps the score — make today count.",
  "Consistency beats perfection every single time.",
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = () => {
    api.get('/dashboard/today')
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }

  const handleWaterUpdate = async (newAmount) => {
    setStats(prev => ({ ...prev, water: newAmount }))
    try {
      await api.put('/dashboard/water', { amount: newAmount })
    } catch (err) {
      console.error('Failed to save water intake', err)
    }
  }

  const statCards = [
    { icon: '⏱️', val: stats ? `${Math.floor(stats.activeMinutes / 60)}h ${stats.activeMinutes % 60}m` : '—', unit: '', label: 'Active Minutes', delta: stats?.activeMinutesDelta, color: 'c1' },
    { icon: '🔥', val: stats?.calories ?? '—', unit: 'kcal', label: 'Calories burned', delta: stats?.caloriesDelta, color: 'c2' },
    { icon: '💧', val: stats ? (Number(stats.water) || 0).toFixed(1) : '—', unit: 'L', label: 'Water intake', color: 'c3' },
    { icon: '😴', val: stats?.sleep ?? '—', unit: 'h', label: 'Sleep last night', color: 'c4' },
  ]

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>{today}</div>
          <h1 className={styles.pageTitle}>
            Good morning, <span>{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
        </div>
        <div className={styles.topbarRight}>
          <div className={styles.streakChip}>🔥 12-day streak</div>
        </div>
      </div>

      {/* Quote banner */}
      <div className={styles.quoteBanner}>
        <span className={styles.quoteLeaf}>🌿</span>
        <p className={styles.quoteText}>
          <strong>Daily reminder —</strong> {quote}
        </p>
      </div>

      {/* Stat cards */}
      <div className={`${styles.statsRow} ${styles.col4}`}>
        {statCards.map((s, i) => (
          <div key={i} className={`${styles.statCard} ${styles[s.color]}`}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statVal}>{s.val}<sup>{s.unit}</sup></div>
            <div className={styles.statLabel}>{s.label}</div>
            {s.delta && (
              <div className={`${styles.statDelta} ${s.delta > 0 ? 'up' : 'dn'}`}>
                {s.delta > 0 ? '↑' : '↓'} {Math.abs(s.delta)}% vs yesterday
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mid grid */}
      <div className={styles.midGrid}>
        {/* Today's workouts */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Today's workouts</span>
            <span className={styles.panelAction}>+ Add</span>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading…</p>
          ) : stats?.workouts?.length ? (
            stats.workouts.map((w, i) => (
              <div key={i} className={styles.workoutItem}>
                <div className={`${styles.wIcon} ${styles[`w${(i%4)+1}`]}`}>{w.icon}</div>
                <div className={styles.wInfo}>
                  <div className={styles.wName}>{w.name}</div>
                  <div className={styles.wMeta}>{w.duration} min · {w.date}</div>
                </div>
                <div className={styles.wCal}>{w.calories} kcal</div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No workouts logged today</p>
          )}
        </div>

        {/* Water tracker */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>💧 Water intake</span>
            <span className={styles.panelAction}>Log</span>
          </div>
          <WaterTracker 
            liters={stats?.water ?? 0} 
            goal={stats?.dailyWaterGoal ?? 2.0} 
            onUpdate={handleWaterUpdate}
          />
        </div>
      </div>

      {/* Progress goals */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Today's progress</span>
          <span className={styles.panelAction}>View all goals →</span>
        </div>
        <div className={styles.goalsGrid}>
          {[
            { label: 'Active Minutes', value: stats?.activeMinutes ?? 0, goal: stats?.activeMinutesGoal ?? 30, color: 'var(--sage)' },
            { label: 'Calories', value: stats?.calories ?? 0, goal: 500, color: 'var(--coral)' },
            { label: 'Water', value: stats?.water ?? 0, goal: stats?.dailyWaterGoal ?? 2.0, color: 'var(--sky)' },
            { label: 'Sleep', value: (stats?.sleep ?? 0) * 60, goal: 480, color: 'var(--lav)' },
          ].map(g => (
            <div key={g.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{g.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                  {Math.min(Math.round(g.value / g.goal * 100), 100)}%
                </span>
              </div>
              <div className={styles.goalBar}>
                <div
                  className={styles.goalFill}
                  style={{
                    width: `${Math.min(g.value / g.goal * 100, 100)}%`,
                    background: g.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WaterTracker({ liters, goal, onUpdate }) {
  const currentLiters = liters
  const total = goal
  const percentage = Math.min(Math.round((currentLiters / total) * 100), 100)
  const glasses = Math.round(currentLiters / 0.2)
  const totalGlasses = Math.round(total / 0.2)

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--sky)', lineHeight: 1 }}>
          {currentLiters.toFixed(1)}L
        </div>
        <div style={{ fontSize: 12, color: 'var(--sky)', fontWeight: 600, marginBottom: 4 }}>
          {percentage}% of daily goal
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Target: {total.toFixed(1)}L ({totalGlasses} glasses)
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
        {Array.from({ length: Math.ceil(total / 0.2) }).map((_, i) => {
          const val = (i + 1) * 0.2
          const isFilled = val <= currentLiters + 0.01 // tiny buffer for float math
          return (
            <button
              key={i}
              onClick={() => onUpdate(val)}
              style={{
                height: 38,
                borderRadius: 8,
                border: `1.5px solid ${isFilled ? 'var(--sky)' : 'var(--border)'}`,
                background: isFilled ? 'rgba(107,168,196,0.15)' : 'var(--bg)',
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {isFilled ? '💧' : '+'}
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 10 }}>
        Each glass is 0.2L · {glasses} glasses consumed
      </p>
    </>
  )
}