import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/WeeklySummary.module.css'

export default function WeeklySummary() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const res = await api.get('/dashboard/summary')
      setData(res.data)
    } catch (err) {
      console.error('Failed to fetch summary', err)
      setError('Could not load summary data. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Generating your weekly report...</p>
    </div>
  )

  if (error) return (
    <div className={styles.errorPage}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <p>{error}</p>
      <button onClick={fetchSummary} className="btn-primary" style={{ marginTop: 20 }}>Retry</button>
    </div>
  )

  const maxCals = data?.dailyData ? Math.max(...data.dailyData.map(d => d.calories), 500) : 500

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Performance Review</div>
          <h1 className="page-title">📊 Weekly <span>Summary</span></h1>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🔥</div>
          <div className={styles.cardLabel}>Weekly Burn</div>
          <div className={styles.cardVal}>{data.totalCalories} <span>kcal</span></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>🏋️</div>
          <div className={styles.cardLabel}>Workouts</div>
          <div className={styles.cardVal}>{data.totalWorkouts} <span>sessions</span></div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>⏱️</div>
          <div className={styles.cardLabel}>Active Time</div>
          <div className={styles.cardVal}>{data.totalDuration} <span>min</span></div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <div className="panel-title">Calorie Expenditure Trend</div>
        </div>
        <div className={styles.chartContainer}>
          {data.dailyData.map((d, i) => (
            <div key={i} className={styles.chartBarGroup}>
              <div 
                className={styles.chartBar} 
                style={{ height: `${(d.calories / maxCals) * 100}%` }}
              >
                {d.calories > 0 && <span className={styles.barTooltip}>{d.calories}</span>}
              </div>
              <div className={styles.chartLabel}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Wellness Insights</div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>✅</div>
            <div className={styles.insightText}>
              Your most active day was <strong>{data.dailyData.reduce((prev, current) => (prev.calories > current.calories) ? prev : current).day}</strong>.
            </div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>💡</div>
            <div className={styles.insightText}>
              You are averaging <strong>{Math.round(data.totalCalories / 7)} kcal</strong> per day this week.
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Goal Adherence</div>
          </div>
          <div className={styles.goalLine}>
            <span>Water Target</span>
            <strong>{data.goals.water} Litres</strong>
          </div>
          <div className={styles.goalLine}>
            <span>Sleep Target</span>
            <strong>{data.goals.sleep} hours</strong>
          </div>
          <div className={styles.goalLine}>
            <span>Weight Goal</span>
            <strong>{data.goals.weight} kg</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
