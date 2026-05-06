import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../styles/Activities.module.css'

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

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const res = await axios.get('http://localhost:3000/activities')
      setActivities(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchActivities() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editing) {
        await axios.put(`http://localhost:3000/activities/${editing}`, form)
      } else {
        await axios.post('http://localhost:3000/activities', form)
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
    setEditing(a.id || a._id)
    setShowForm(true)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this activity?')) return
    try {
      await axios.delete(`http://localhost:3000/activities/${id}`)
      fetchActivities()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter === 'All' ? activities : activities.filter(a => a.type === filter)
  const totalCal = activities.reduce((s, a) => s + Number(a.calories || 0), 0)
  const totalMin = activities.reduce((s, a) => s + Number(a.duration || 0), 0)

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitleSm}>Fitness tracker</div>
          <h1 className={styles.pageTitle}>Workouts <span>& Activities</span></h1>
        </div>
        <button className={styles.btnPrimary} onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm) }}>
          + Add workout
        </button>
      </div>

      <div className={styles.summaryRow}>
        <div className={styles.statCard} style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏃</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{activities.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase' }}>Workouts</div>
        </div>
        <div className={styles.statCard} style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔥</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{totalCal.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase' }}>Kcal Burned</div>
        </div>
        <div className={styles.statCard} style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏱️</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{Math.floor(totalMin / 60)}h {totalMin % 60}m</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase' }}>Active Time</div>
        </div>
      </div>

      {showForm && (
        <div className={styles.formPanel}>
          <div className={styles.panelTitle}>{editing ? 'Edit Workout' : 'New Workout'}</div>
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
                <input type="number" name="duration" value={form.duration} onChange={handleChange} className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Calories</label>
                <input type="number" name="calories" value={form.calories} onChange={handleChange} className={styles.input} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Notes</label>
              <input name="notes" value={form.notes} onChange={handleChange} className={styles.input} placeholder="How was your workout?" />
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnOutline} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Update' : 'Add workout'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.activitiesList}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>Loading workouts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'var(--surface)', borderRadius: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👟</div>
            <p style={{ color: 'var(--text2)' }}>No workouts recorded. Time to move!</p>
          </div>
        ) : (
          filtered.map(a => (
            <div key={a.id || a._id} className={styles.activityCard}>
              <div className={styles.activityIcon}>{ICONS[a.type] || '🤸'}</div>
              <div className={styles.activityInfo}>
                <div className={styles.activityName}>{a.type}</div>
                <div className={styles.activityMeta}>
                  {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {a.duration} min
                  {a.notes && ` · ${a.notes}`}
                </div>
              </div>
              <div className={styles.activityStats}>
                <div className={styles.activityCal}>{a.calories} kcal</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, justifyContent: 'flex-end' }}>
                  <button onClick={() => handleEdit(a)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>✏️</button>
                  <button onClick={() => handleDelete(a.id || a._id)} className={styles.deleteBtn} style={{ opacity: 1, position: 'static' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}