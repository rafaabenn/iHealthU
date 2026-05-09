import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import styles from '../styles/Dashboard.module.css'

import {
  Timer, Fire, Drop, Bed, Leaf,
  Barbell, Bicycle, Person, Footprints,
  Waves, Lightning, Heartbeat, HandWaving
} from '@phosphor-icons/react'

const WORKOUT_ICONS = {
  Running: { icon: <Heartbeat size={17} weight="duotone" />, color: '#E85D3A', bg: 'rgba(232,93,58,0.1)' },
  Cycling: { icon: <Bicycle size={17} weight="duotone" />, color: '#3A9BE8', bg: 'rgba(58,155,232,0.1)' },
  Swimming: { icon: <Waves size={17} weight="duotone" />, color: '#3AB8E8', bg: 'rgba(58,184,232,0.1)' },
  Yoga: { icon: <Person size={17} weight="duotone" />, color: '#9B6FE8', bg: 'rgba(155,111,232,0.1)' },
  'Weight training': { icon: <Barbell size={17} weight="duotone" />, color: '#E8A23A', bg: 'rgba(232,162,58,0.1)' },
  Walking: { icon: <Footprints size={17} weight="duotone" />, color: '#5AE872', bg: 'rgba(90,232,114,0.1)' },
  HIIT: { icon: <Lightning size={17} weight="duotone" />, color: '#E8C83A', bg: 'rgba(232,200,58,0.1)' },
  Other: { icon: <Heartbeat size={17} weight="duotone" />, color: '#E85D9B', bg: 'rgba(232,93,155,0.1)' },
}

// ── 30 quotes — one per day, cycling every month ──────────────────────────
const QUOTES = [
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "The groundwork of all happiness is health.", author: "Leigh Hunt" },
  { text: "To keep the body in good health is a duty, otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
  { text: "Physical fitness is not only one of the most important keys to a healthy body, it is the basis of dynamic and creative intellectual activity.", author: "JFK" },
  { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
  { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
  { text: "Health is not valued until sickness comes.", author: "Thomas Fuller" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Small progress is still progress. Keep moving.", author: "iHealthU" },
  { text: "Consistency beats perfection every single time.", author: "iHealthU" },
  { text: "Your body keeps the score — make today count.", author: "iHealthU" },
  { text: "Every step forward is a step toward a healthier you.", author: "iHealthU" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "An early morning walk is a blessing for the whole day.", author: "Henry Thoreau" },
  { text: "Movement is medicine for creating change in a person's physical, emotional, and mental states.", author: "Carol Welch" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Take care of your body and it will take care of you.", author: "iHealthU" },
  { text: "Strength does not come from the physical capacity. It comes from an indomitable will.", author: "Gandhi" },
  { text: "Eat well, move daily, hydrate often, sleep lots, love your body.", author: "iHealthU" },
  { text: "No matter how slow you go, you are still lapping everyone on the couch.", author: "iHealthU" },
  { text: "Rest when you're weary. Refresh and renew yourself, your body, your mind.", author: "Ralph Marston" },
  { text: "Take care of yourself so you can take care of others.", author: "iHealthU" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your health is an investment, not an expense.", author: "iHealthU" },
  { text: "Don't wish for it. Work for it.", author: "iHealthU" },
  { text: "Every workout is a step in the right direction.", author: "iHealthU" },
]

function getDailyQuote() {
  const now = new Date()
  // day-of-year gives a stable number that changes at midnight
  const start   = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now - start) / 86400000)
  return QUOTES[dayOfYear % QUOTES.length]
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long',
  })
  
  const [quote] = useState(() => getDailyQuote())

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
    {
      icon: <Timer size={22} weight="duotone" />,
      val: stats ? `${Math.floor(stats.activeMinutes / 60)}h ${stats.activeMinutes % 60}m` : '—',
      unit: '', label: 'Active Minutes', delta: stats?.activeMinutesDelta, color: 'c1'
    },
    {
      icon: <Fire size={22} weight="duotone" />,
      val: stats?.calories ?? '—',
      unit: 'kcal', label: 'Calories burned', delta: stats?.caloriesDelta, color: 'c2'
    },
    {
      icon: <Drop size={22} weight="duotone" />,
      val: stats ? (Number(stats.water) || 0).toFixed(1) : '—',
      unit: 'L', label: 'Water intake', color: 'c3'
    },
    {
      icon: <Bed size={22} weight="duotone" />,
      val: stats?.sleep ?? '—',
      unit: 'h', label: 'Sleep last night', color: 'c4'
    },
  ]


  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>{today}</div>
          <h1 className={styles.pageTitle}>
            Good morning, <span>{user?.name?.split(' ')[0] || 'there'}</span>{' '}
            <HandWaving size={20} weight="duotone" color="#4A7C6F" />
          </h1>
        </div>
        <div className={styles.topbarRight}>
          <div className={`${styles.streakChip} ${stats?.currentStreak > 0 ? styles.streakActive : ''}`}>
            <Fire size={14} weight="duotone" style={{ color: 'var(--coral)' }} />
            {stats?.currentStreak ?? 0}-day streak
          </div>
        </div>
      </div>

      {/* Quote banner */}
      <div className={styles.quoteBanner}>
        <Leaf size={24} weight="duotone" style={{ color: 'var(--mint)', flexShrink: 0 }} />        <p className={styles.quoteText}>
          <strong>Daily reminder —</strong> {quote.text}
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
            <span className={styles.panelTitle}>Today's activities</span>
            <span className={styles.panelAction} onClick={() => navigate("/dashboard/activities")}>+ Add</span>
          </div>
          {loading ? (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading…</p>
          ) : stats?.workouts?.length ? (

            stats.workouts.map((w, i) => {
              const meta = WORKOUT_ICONS[w.name] ?? WORKOUT_ICONS.Other
              return (
                <div key={i} className={styles.workoutItem}>
                  <div
                    className={styles.wIcon}
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </div>
                  <div className={styles.wInfo}>
                    <div className={styles.wName}>{w.name}</div>
                    <div className={styles.wMeta}>{w.duration} min · {w.date}</div>
                  </div>
                  <div className={styles.wCal}>{w.calories} kcal</div>
                </div>
              )
            })
          ) : (
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>No workouts logged today</p>
          )}
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
                background: isFilled ? 'rgba(107,168,196,0.18)' : 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {isFilled
                ? <Drop size={16} weight="duotone" color="#6BA8C4" />
                : <span style={{ fontSize: 14, color: 'var(--text3)' }}>+</span>
              }
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