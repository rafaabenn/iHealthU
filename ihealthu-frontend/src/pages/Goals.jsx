import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/Goals.module.css'
import { Fire, Barbell, Drop, Timer, Moon, FloppyDisk, CheckCircle } from '@phosphor-icons/react'

const DEFAULT_GOALS = {
  dailyCalories:      '',
  weeklyWorkouts:     '',
  dailyWater:         '',
  dailyActiveMinutes: '',
  sleepHours:         '',
}

export default function Goals() {
  const [goals, setGoals]           = useState(DEFAULT_GOALS)
  const [saved, setSaved]           = useState(false)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/goals')
      .then(res => setGoals({ ...DEFAULT_GOALS, ...res.data }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setGoals(g => ({ ...g, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put('/goals', goals)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const goalFields = [
    { name: 'dailyCalories',      Icon: Fire,    color: '#E8715A', label: 'Daily calories target', unit: 'kcal burned', placeholder: '400',  type: 'number', hint: 'Calories to burn through exercise per day'  },
    { name: 'weeklyWorkouts',     Icon: Barbell, color: '#E8A84A', label: 'Workouts per week',      unit: 'sessions',   placeholder: '4',    type: 'number', hint: 'How many workout sessions per week'         },
    { name: 'dailyWater',         Icon: Drop,    color: '#6BA8C4', label: 'Daily water intake',     unit: 'Litres',     placeholder: '2.5',  type: 'number', hint: 'Amount of water to drink per day', step: 0.1 },
    { name: 'dailyActiveMinutes', Icon: Timer,   color: '#4A7C6F', label: 'Daily active minutes',   unit: 'min',        placeholder: '30',   type: 'number', hint: 'Total workout duration target per day'      },
    { name: 'sleepHours',         Icon: Moon,    color: '#9B8EC4', label: 'Sleep target',           unit: 'hours / night', placeholder: '8', type: 'number', hint: 'Target sleep duration', step: 0.5          },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>Personal targets</div>
          <h1 className={styles.pageTitle}>Daily <span>Goals</span></h1>
        </div>
        {saved && (
          <div className={styles.savedBanner} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={15} weight="duotone" color="var(--forest)" />
            Goals saved successfully!
          </div>
        )}
      </div>

      <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: -10 }}>
        Set your personal health targets. These will be used to track your daily progress.
      </p>

      {loading ? (
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading your goals…</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.goalsGrid}>
            {goalFields.map(f => (
              <div key={f.name} className={styles.goalCard}>
                <div className={styles.goalIcon}>
                  <f.Icon size={28} weight="duotone" color={f.color} />
                </div>
                <div className={styles.goalContent}>
                  <label className={styles.goalLabel}>{f.label}</label>
                  <p className={styles.goalHint}>{f.hint}</p>
                  <div className={styles.inputRow}>
                    <input
                      type={f.type}
                      name={f.name}
                      value={goals[f.name]}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder={f.placeholder}
                      min="0"
                      step={f.step || 1}
                    />
                    <span className={styles.unit}>{f.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={submitting}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FloppyDisk size={16} weight="duotone" />
            {submitting ? 'Saving…' : 'Save goals'}
          </button>
        </form>
      )}
    </div>
  )
}