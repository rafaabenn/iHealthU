import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/Goals.module.css'

const DEFAULT_GOALS = {
  targetWeight: '',
  dailyCalories: '',
  weeklyWorkouts: '',
  dailyWater: '',
  dailySteps: '',
  sleepHours: '',
}

export default function Goals() {
  const [goals, setGoals] = useState(DEFAULT_GOALS)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
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
    { name: 'targetWeight', icon: '⚖️', label: 'Target weight', unit: 'kg', placeholder: '70', type: 'number', hint: 'Your ideal body weight goal' },
    { name: 'dailyCalories', icon: '🔥', label: 'Daily calories target', unit: 'kcal burned', placeholder: '400', type: 'number', hint: 'Calories to burn through exercise per day' },
    { name: 'weeklyWorkouts', icon: '🏋️', label: 'Workouts per week', unit: 'sessions', placeholder: '4', type: 'number', hint: 'How many workout sessions per week' },
    { name: 'dailyWater', icon: '💧', label: 'Daily water intake', unit: 'glasses (250ml)', placeholder: '8', type: 'number', hint: 'Number of water glasses per day' },
    { name: 'dailySteps', icon: '👟', label: 'Daily step goal', unit: 'steps', placeholder: '10000', type: 'number', hint: 'Steps to take each day' },
    { name: 'sleepHours', icon: '🌙', label: 'Sleep target', unit: 'hours / night', placeholder: '8', type: 'number', hint: 'Target sleep duration', step: 0.5 },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>Personal targets</div>
          <h1 className={styles.pageTitle}>Daily <span>Goals</span></h1>
        </div>
        {saved && <div className={styles.savedBanner}>✓ Goals saved successfully!</div>}
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
                <div className={styles.goalIcon}>{f.icon}</div>
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

          <button type="submit" className={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Saving…' : '💾 Save goals'}
          </button>
        </form>
      )}
    </div>
  )
}