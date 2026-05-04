import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from './HealthMetrics.module.css'

const emptyForm = {
  weight: '', systolic: '', diastolic: '',
  heartRate: '', date: new Date().toISOString().split('T')[0]
}

export default function HealthMetrics() {
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchLogs = () => {
    setLoading(true)
    api.get('/health')
      .then(res => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLogs() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/health', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      fetchLogs()
      setForm(emptyForm)
    } catch (err) { console.error(err) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this entry?')) return
    await api.delete(`/health/${id}`)
    fetchLogs()
  }

  const latest = logs[0] || null

  // Simple SVG weight chart
  const weightData = logs.filter(l => l.weight).slice(0, 14).reverse()

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>Daily tracking</div>
          <h1 className={styles.pageTitle}>Health <span>Metrics</span></h1>
        </div>
      </div>

      {/* Latest readings */}
      {latest && (
        <div className={styles.statsRow}>
          {[
            { icon: '⚖️', val: latest.weight, unit: 'kg', label: 'Weight', color: 'c1' },
            { icon: '🫀', val: latest.systolic && latest.diastolic ? `${latest.systolic}/${latest.diastolic}` : '—', unit: 'mmHg', label: 'Blood pressure', color: 'c2' },
            { icon: '💓', val: latest.heartRate, unit: 'bpm', label: 'Heart rate', color: 'c3' },
          ].map((s, i) => (
            <div key={i} className={`${styles.statCard} ${styles[s.color]}`}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statVal}>{s.val ?? '—'}<sup>{s.unit}</sup></div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statSub}>
                Latest · {new Date(latest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.midGrid}>
        {/* Log form */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>📝 Log today's metrics</span>
            {saved && <span className={styles.savedBadge}>✓ Saved!</span>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Weight (kg)</label>
                <input type="number" name="weight" value={form.weight} onChange={handleChange}
                  className={styles.input} placeholder="70.5" step="0.1" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Systolic (mmHg)</label>
                <input type="number" name="systolic" value={form.systolic} onChange={handleChange}
                  className={styles.input} placeholder="120" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Diastolic (mmHg)</label>
                <input type="number" name="diastolic" value={form.diastolic} onChange={handleChange}
                  className={styles.input} placeholder="80" />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                <label className={styles.label}>Heart rate (bpm)</label>
                <input type="number" name="heartRate" value={form.heartRate} onChange={handleChange}
                  className={styles.input} placeholder="72" />
              </div>
            </div>
            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Saving…' : 'Save metrics'}
            </button>
          </form>
        </div>

        {/* Weight chart */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>⚖️ Weight evolution</span>
          </div>
          <WeightChart data={weightData} />
        </div>
      </div>

      {/* History table */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>📅 Health history</span>
        </div>
        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>Loading…</p>
        ) : logs.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: 20 }}>
            No entries yet. Start logging your metrics!
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th><th>Weight</th><th>Blood pressure</th><th>Heart rate</th><th></th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l._id || l.id}>
                  <td>{new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>{l.weight ? `${l.weight} kg` : '—'}</td>
                  <td>{l.systolic && l.diastolic ? `${l.systolic}/${l.diastolic} mmHg` : '—'}</td>
                  <td>{l.heartRate ? `${l.heartRate} bpm` : '—'}</td>
                  <td>
                    <button onClick={() => handleDelete(l._id || l.id)} className={styles.deleteBtn}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function WeightChart({ data }) {
  if (data.length < 2) return (
    <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: 30 }}>
      Log at least 2 entries to see your chart
    </p>
  )

  const W = 300, H = 150, PAD = 20
  const weights = data.map(d => Number(d.weight))
  const minW = Math.min(...weights) - 1
  const maxW = Math.max(...weights) + 1
  const xScale = i => PAD + (i / (data.length - 1)) * (W - PAD * 2)
  const yScale = w => H - PAD - ((w - minW) / (maxW - minW)) * (H - PAD * 2)

  const pts = data.map((d, i) => `${xScale(i)},${yScale(Number(d.weight))}`).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t}
          x1={PAD} y1={PAD + t * (H - PAD * 2)}
          x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
          stroke="rgba(0,0,0,0.05)" strokeWidth="1"
        />
      ))}
      {/* Weight line */}
      <polyline points={pts} fill="none" stroke="var(--sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {data.map((d, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(Number(d.weight))} r={4}
          fill="var(--surface)" stroke="var(--sage)" strokeWidth="2.5" />
      ))}
      {/* Labels */}
      {data.map((d, i) => (
        <text key={i} x={xScale(i)} y={yScale(Number(d.weight)) - 10}
          textAnchor="middle" fontSize="10" fill="var(--text2)" fontFamily="Sora, sans-serif">
          {d.weight}
        </text>
      ))}
    </svg>
  )
}