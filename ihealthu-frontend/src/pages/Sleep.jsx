import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/Sleep.module.css'
import { Moon, Bed, CheckCircle, CloudMoon, PencilSimple, ArrowRight } from '@phosphor-icons/react'

export default function Sleep() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
    startTime: '22:00',
    endTime: '06:00'
  })
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { fetchLogs(endDate) }, [endDate])

  useEffect(() => {
    const existingLog = logs.find(l => l.date === form.date)
    if (existingLog) {
      setForm(prev => ({ ...prev, startTime: existingLog.startTime, endTime: existingLog.endTime }))
    }
  }, [form.date, logs])

  const fetchLogs = async (date) => {
    setLoading(true)
    try {
      const res = await api.get(`/sleep?endDate=${date}`)
      setLogs(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Failed to fetch sleep logs', err)
    } finally {
      setLoading(false)
    }
  }

  const changeWeek = (offset) => {
    const d = new Date(endDate)
    d.setDate(d.getDate() + offset)
    setEndDate(d.toISOString().split('T')[0])
  }

  const isToday = endDate === new Date().toISOString().split('T')[0]

  const calculateDuration = (start, end) => {
    const [sH, sM] = start.split(':').map(Number)
    const [eH, eM] = end.split(':').map(Number)
    let startMinutes = sH * 60 + sM
    let endMinutes   = eH * 60 + eM
    if (endMinutes < startMinutes) endMinutes += 24 * 60
    return (endMinutes - startMinutes) / 60
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    const duration = calculateDuration(form.startTime, form.endTime)
    try {
      await api.post('/sleep', { ...form, duration })
      await fetchLogs()
    } catch (err) {
      console.error('Failed to save sleep log', err)
    } finally {
      setSaving(false)
    }
  }

  const duration  = calculateDuration(form.startTime, form.endTime)
  const progress  = Math.min((duration / 8) * 100, 100)
  const weeklyAvg = logs.length > 0
    ? (logs.reduce((acc, curr) => acc + curr.duration, 0) / logs.length).toFixed(1)
    : '0.0'
  const isUpdating = logs.some(l => l.date === form.date)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.pageTitleSm}>Rest & Recovery</div>
        <h1 className={styles.pageTitle}>
          <Moon size={26} weight="duotone" color="var(--lav)" style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Sleep <span>Tracker</span>
        </h1>
        <div className="week-nav">
          <button className="nav-btn" onClick={() => changeWeek(-7)}>←</button>
          <div className="week-label">
            {endDate} (Week)
          </div>
          <button
            className="nav-btn"
            onClick={() => changeWeek(7)}
            disabled={isToday}
          >
            →
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left Card: Log Sleep */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Log Sleep</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Date</label>
              <input type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className={styles.timeInput} />
            </div>
            <div className={styles.inputGroup}>
              <label>Bedtime</label>
              <input type="time" value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })}
                className={styles.timeInput} />
            </div>
            <div className={styles.inputGroup}>
              <label>Wake up time</label>
              <input type="time" value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })}
                className={styles.timeInput} />
            </div>

            <div className={styles.calculation}>
              {isUpdating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--lav)', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                  <PencilSimple size={13} weight="duotone" color="var(--lav)" />
                  Editing existing log for this date
                </div>
              )}
              <div className={styles.calcLabel}>Calculated Duration</div>
              <div className={styles.calcVal}>{duration.toFixed(1)} <span>hours</span></div>
              <div className={styles.calcProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
                <span>{Math.round(progress)}% of 8h goal</span>
              </div>
            </div>

            <button type="submit" className={styles.btnLog} disabled={saving}>
              {saving ? 'Logging...' : isUpdating ? 'Update Sleep' : 'Log Sleep'}
            </button>
          </form>
        </div>

        {/* Right Card: Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Bed size={40} weight="duotone" color="rgba(255,255,255,0.9)" />
          </div>
          <div className={styles.summaryTitle}>Weekly Average</div>
          <div className={styles.summaryVal}>{duration.toFixed(1)} <span>hours / night</span></div>
          <p className={styles.summaryHint}>
            Consistent sleep helps with muscle recovery and mental focus.
          </p>
        </div>
      </div>

      {/* History Section */}
      <div className={styles.historyPanel}>
        <h2 className={styles.panelTitle}>Sleep History</h2>
        {loading ? (
          <p className={styles.empty}>Loading history...</p>
        ) : (
          <div className={styles.historyList}>
            {logs.map(log => {
              const dateStr = new Date(log.date).toLocaleDateString('en-GB',
                { weekday: 'short', day: 'numeric', month: 'short' })
              const isMet = log.duration >= 8
              return (
                <div key={log.id} className={styles.historyItem}>
                  <div className={styles.historyDate}>{dateStr}</div>
                  <div className={styles.historyTimes} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{log.startTime}</span>
                    <ArrowRight size={12} weight="bold" color="var(--text3)" />
                    <span>{log.endTime}</span>
                  </div>
                  <div className={styles.historyDuration}>{log.duration.toFixed(1)}h</div>
                  <div className={styles.historyStatus}>
                    {isMet ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--sage)' }}>
                        <CheckCircle size={14} weight="duotone" color="var(--sage)" /> On track
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text3)' }}>
                        <CloudMoon size={14} weight="duotone" color="var(--lav)" /> Under goal
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {logs.length === 0 && <p className={styles.empty}>No sleep history yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}