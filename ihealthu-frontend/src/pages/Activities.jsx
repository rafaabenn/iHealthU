import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from './Activities.module.css'

const ACTIVITY_TYPES = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weight training', 'Walking', 'HIIT', 'Other']
const ICONS = { Running: '🏃', Cycling: '🚴', Swimming: '🏊', Yoga: '🧘', 'Weight training': '🏋️', Walking: '👟', HIIT: '⚡', Other: '🤸' }

const emptyForm = { type: 'Running', duration: '', date: new Date().toISOString().split('T')[0], calories: '', notes: '' }

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState('All')
  const [submitting, setSubmitting] = useState(false)

  const fetchActivities = () => {
    setLoading(true)
    api.get('/activities')
      .then(res => setActivities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchActivities() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        await api.put(`/activities/${editing}`, form)
      } else {
        await api.post('/activities', form)
      }
      fetchActivities()
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = a => {
    setForm({ type: a.type, duration: a.duration, date: a.date?.split('T')[0], calories: a.calories, notes: a.notes || '' })
    setEditing(a._id || a.id)
    setShowForm(true)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this activity?')) return
    await api.delete(`/activities/${id}`)
    fetchActivities()
  }

  const filtered = filter === 'All' ? activities : activities.filter(a => a.type === filter)
  const totalCal = activities.reduce((s, a) => s + Number(a.calories || 0), 0)
  const totalMin = activities.reduce((s, a) => s + Number(a.duration || 0), 0)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>Fitness tracker</div>
          <h1 className={styles.pageTitle}>Workouts <span>&amp; Activities</span></h1>
        </div>
        <button className={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}>
          + Add workout
        </button>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryRow}>
        <div className={styles.sumCard}>
          <div className={styles.sumIcon}>🏃</div>
          <div className={styles.sumVal}>{activities.length}</div>
          <div className={styles.sumLabel}>Total workouts</div>
        </div>
        <div className={styles.sumCard}>
          <div className={styles.sumIcon}>🔥</div>
          <div className={styles.sumVal}>{totalCal.toLocaleString()}<sup>kcal</sup></div>
          <div className={styles.sumLabel}>Total burned</div>
        </div>
        <div className={styles.sumCard}>
          <div className={styles.sumIcon}>⏱️</div>
          <div className={styles.sumVal}>{Math.floor(totalMin / 60)}<sup>h</sup> {totalMin % 60}<sup>m</sup></div>
          <div className={styles.sumLabel}>Total time</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        {['All', ...ACTIVITY_TYPES].map(f => (
          <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.on : ''}`}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <span className={styles.panelTitle}>{editing ? 'Edit workout' : 'New workout'}</span>
            <button className={styles.closeBtn} onClick={() => { setShowForm(false); setEditing(null) }}>✕</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Type</label>
                <select name="type" value={form.type} onChange={handleChange} className={`${styles.input} ${styles.select}`}>
                  {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Duration (min)</label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange}
                  className={styles.input} placeholder="45" min="1" required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Calories burned</label>
                <input type="number" name="calories" value={form.calories} onChange={handleChange}
                  className={styles.input} placeholder="300" min="0" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Notes (optional)</label>
              <input name="notes" value={form.notes} onChange={handleChange}
                className={styles.input} placeholder="How did it feel?" />
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnOutline} onClick={() => { setShowForm(false); setEditing(null) }}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Saving…' : editing ? 'Update' : 'Add workout'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activities list */}
      <div className={styles.activitiesList}>
        {loading ? (
          <p style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: 30 }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏃</div>
            <p>No workouts yet. Add your first one!</p>
          </div>
        ) : (
          filtered.map(a => (
            <div key={a._id || a.id} className={styles.activityCard}>
              <div className={styles.actIcon}>{ICONS[a.type] || '🤸'}</div>
              <div className={styles.actInfo}>
                <div className={styles.actName}>{a.type}</div>
                <div className={styles.actMeta}>
                  📅 {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  &nbsp;·&nbsp; ⏱️ {a.duration} min
                  {a.notes && <>&nbsp;·&nbsp; {a.notes}</>}
                </div>
              </div>
              <div className={styles.actRight}>
                {a.calories && <div className={styles.actCal}>{a.calories} kcal</div>}
                <div className={styles.actActions}>
                  <button onClick={() => handleEdit(a)} className={styles.iconBtn}>✏️</button>
                  <button onClick={() => handleDelete(a._id || a.id)} className={styles.iconBtnDanger}>🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}