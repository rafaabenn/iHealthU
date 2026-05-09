import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/Sleep.module.css'

export default function SleepPage() {
  const [bedtime, setBedtime] = useState('22:00')
  const [waketime, setWaketime] = useState('07:00')
  const [duration, setDuration] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [goal, setGoal] = useState(8)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    calculateDuration()
  }, [bedtime, waketime])

  const fetchData = async () => {
    try {
      const [historyRes, todayRes] = await Promise.all([
        api.get('/dashboard/sleep'),
        api.get('/dashboard/today')
      ])
      setHistory(historyRes.data)
      if (todayRes.data?.sleepGoal) {
        setGoal(todayRes.data.sleepGoal)
      }
    } catch (err) {
      console.error('Failed to fetch sleep data', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateDuration = () => {
    const [bedH, bedM] = bedtime.split(':').map(Number)
    const [wakeH, wakeM] = waketime.split(':').map(Number)
    
    let start = new Date()
    start.setHours(bedH, bedM, 0)
    
    let end = new Date()
    end.setHours(wakeH, wakeM, 0)
    
    if (end < start) {
      end.setDate(end.getDate() + 1)
    }
    
    const diffMs = end - start
    const diffHours = diffMs / (1000 * 60 * 60)
    setDuration(diffHours)
  }

  const handleLogSleep = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/dashboard/sleep', { bedtime, waketime, duration })
      fetchData() // Refresh history
    } catch (err) {
      console.error('Failed to log sleep', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading sleep data...</div>

  const lastNight = history[0]
  const percentage = Math.min(Math.round((duration / goal) * 100), 100)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.pageTitleSm}>Rest & Recovery</div>
          <h1 className={styles.pageTitle}>🌙 Sleep <span>Tracker</span></h1>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Input Panel */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Log Last Night</h2>
          <form onSubmit={handleLogSleep} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Bedtime</label>
              <input 
                type="time" 
                value={bedtime} 
                onChange={(e) => setBedtime(e.target.value)} 
                className={styles.timeInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Wake up time</label>
              <input 
                type="time" 
                value={waketime} 
                onChange={(e) => setWaketime(e.target.value)} 
                className={styles.timeInput}
              />
            </div>

            <div className={styles.calculation}>
              <div className={styles.calcLabel}>Calculated Duration</div>
              <div className={styles.calcVal}>{duration.toFixed(1)} <span>hours</span></div>
              <div className={styles.calcProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span>{percentage}% of {goal}h goal</span>
              </div>
            </div>

            <button type="submit" className={styles.btnLog} disabled={saving}>
              {saving ? 'Logging...' : 'Log Sleep'}
            </button>
          </form>
        </div>

        {/* Summary Card */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>😴</div>
          <h3 className={styles.summaryTitle}>Weekly Average</h3>
          <div className={styles.summaryVal}>
            {history.length > 0 
              ? (history.reduce((acc, curr) => acc + curr.duration, 0) / history.length).toFixed(1)
              : '—'
            }
            <span> hours / night</span>
          </div>
          <p className={styles.summaryHint}>
            Consistent sleep helps with muscle recovery and mental focus.
          </p>
        </div>
      </div>

      {/* History List */}
      <div className={styles.historyPanel}>
        <h2 className={styles.panelTitle}>Sleep History</h2>
        <div className={styles.historyList}>
          {history.length > 0 ? (
            history.map((log, i) => (
              <div key={i} className={styles.historyItem}>
                <div className={styles.historyDate}>
                  {new Date(log.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div className={styles.historyTimes}>
                  <span>{log.bedtime}</span> → <span>{log.waketime}</span>
                </div>
                <div className={styles.historyDuration}>
                  <strong>{log.duration.toFixed(1)}h</strong>
                </div>
                <div className={styles.historyStatus}>
                  {log.duration >= goal ? '✅ Goal met' : '💤 Under goal'}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>No sleep logs found. Start by logging last night!</div>
          )}
        </div>
      </div>
    </div>
  )
}
