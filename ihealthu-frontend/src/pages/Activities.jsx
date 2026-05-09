import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import styles from '../styles/Activities.module.css'
import {
  PersonSimpleRun, Heartbeat, Bicycle, Waves, Person, Barbell,
  Footprints, Lightning, Trophy, Fire, Timer,
  PencilSimple, Plus, X, Trash, CircleNotch, CalendarBlank
} from '@phosphor-icons/react'

const TYPES = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weight training', 'Walking', 'HIIT', 'Other']

const META = {
  Running:           { Icon: PersonSimpleRun, color: '#e85d3ad2', bg: 'rgba(232,93,58,0.1)',   tag: 'Cardio'      },
  Cycling:           { Icon: Bicycle,         color: '#3a9ae8da', bg: 'rgba(58,155,232,0.1)',  tag: 'Cardio'      },
  Swimming:          { Icon: Waves,           color: '#3AB8E8', bg: 'rgba(58,184,232,0.1)',  tag: 'Cardio'      },
  Yoga:              { Icon: Person,          color: '#9b6fe8e0', bg: 'rgba(155,111,232,0.1)', tag: 'Flexibility' },
  'Weight training': { Icon: Barbell,         color: '#edad4ddc', bg: 'rgba(232,162,58,0.1)',  tag: 'Strength'    },
  Walking:           { Icon: Footprints,      color: '#53b863d0', bg: 'rgba(90,232,114,0.1)',  tag: 'Cardio'      },
  HIIT:              { Icon: Lightning,       color: '#E8C83A', bg: 'rgba(232,200,58,0.1)',  tag: 'Intensity'   },
  Other:             { Icon: Heartbeat,       color: '#e85d9ccf', bg: 'rgba(232,93,155,0.1)',  tag: 'Activity'    },
}

const emptyForm = {
  type: 'Running',
  duration: '',
  date: new Date().toISOString().split('T')[0],
  calories: '',
  notes: '',
}

export default function Activities() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(emptyForm)
  const [filter, setFilter]         = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState(null)
  const formRef = useRef(null)

  const fetchActivities = async () => {
    setLoading(true); setError(null)
    try {
      const res = await api.get('/activities')
      setActivities(res.data)
    } catch (err) {
      if (err.response?.status === 401) setError('Session expirée — reconnecte-toi.')
      else setError('Erreur de chargement des activités.')
    } finally { setLoading(false) }
  }
  useEffect(() => { fetchActivities() }, [])

  useEffect(() => {
    if (showForm && formRef.current)
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }, [showForm])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const openAdd   = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null) }

  const handleSubmit = async e => {
    e.preventDefault(); setSubmitting(true)
    const tempId = 'temp_' + Date.now()
    if (editing) {
      setActivities(prev => prev.map(a =>
        (a.id === editing || a._id === editing) ? { ...a, ...form } : a
      ))
      closeForm()
      try { await api.put(`/activities/${editing}`, form); fetchActivities() }
      catch { fetchActivities() }
    } else {
      setActivities(prev => [{ ...form, id: tempId }, ...prev])
      closeForm()
      try {
        const res = await api.post('/activities', form)
        setActivities(prev => prev.map(a => a.id === tempId ? res.data : a))
      } catch {
        setActivities(prev => prev.filter(a => a.id !== tempId))
      }
    }
    setSubmitting(false)
  }

  const handleEdit = a => {
    setForm({
      type: a.type, duration: a.duration,
      date: a.date?.split('T')[0], calories: a.calories, notes: a.notes || '',
    })
    setEditing(a.id || a._id); setShowForm(true)
  }

  const handleDelete = async id => {
    if (!confirm('Supprimer cette activité ?')) return
    setActivities(prev => prev.filter(a => (a.id || a._id) !== id))
    try { await api.delete(`/activities/${id}`) }
    catch { fetchActivities() }
  }

  const filtered = activities.filter(a => {
    const matchType = filter === 'All' || a.type === filter
    const matchDate = !dateFilter || a.date?.startsWith(dateFilter)
    return matchType && matchDate
  })
  const totalCal = filtered.reduce((s, a) => s + Number(a.calories || 0), 0)
  const totalMin = filtered.reduce((s, a) => s + Number(a.duration || 0), 0)

  return (
    <div className={styles.page}>

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className={styles.title}>
            Workouts <span className={styles.accent}>&amp; Activities</span>
          </h1>
        </div>
        <button className={styles.btnAdd} onClick={openAdd}>
          <Plus size={16} weight="bold" /> Add workout
        </button>
      </div>

      {/* STATS */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statEmoji}>
            <Trophy size={30} weight="duotone" color="#E8A23A" />
          </span>
          <div>
            <div className={styles.statVal}>{filtered.length}</div>
            <div className={styles.statLabel}>Total Workouts</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statEmoji}>
            <Fire size={30} weight="duotone" color="#E85D3A" />
          </span>
          <div>
            <div className={styles.statVal}>{totalCal.toLocaleString()} <span className={styles.statUnit}>kcal</span></div>
            <div className={styles.statLabel}>Calories Burned</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statEmoji}>
            <Timer size={30} weight="duotone" color="#4A7C6F" />
          </span>
          <div>
            <div className={styles.statVal}>{Math.floor(totalMin / 60)}h {totalMin % 60}m</div>
            <div className={styles.statLabel}>Active Time</div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

      {/* FORM */}
      {showForm && (
        <div className={styles.formCard} ref={formRef}>
          <div className={styles.formHeader}>
            <span className={styles.formTitle}>
              {editing
                ? <><PencilSimple size={15} weight="duotone" /> Edit Workout</>
                : <><Plus size={15} weight="bold" /> New Workout</>
              }
            </span>
            <button className={styles.closeBtn} onClick={closeForm}>
              <X size={16} />
            </button>
          </div>

          <div className={styles.typePicker}>
            {TYPES.map(t => {
              const m = META[t]
              return (
                <button
                  key={t}
                  type="button"
                  className={`${styles.typeChip} ${form.type === t ? styles.typeChipActive : ''}`}
                  style={form.type === t
                    ? { background: m.bg, borderColor: m.color, color: m.color }
                    : { borderColor: m.color + '60' }}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                >
                  <m.Icon size={14} weight="duotone" color={m.color} />
                  {t}
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Duration (min)</label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange}
                  className={styles.input} min="1" required placeholder="45" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Calories burned</label>
                <input type="number" name="calories" value={form.calories} onChange={handleChange}
                  className={styles.input} placeholder="350" />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Notes</label>
                <input name="notes" value={form.notes} onChange={handleChange}
                  className={styles.input} placeholder="How was your session?" />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={closeForm}>Cancel</button>
              <button type="submit" className={styles.btnSave} disabled={submitting}>
                {submitting ? 'Saving…' : editing ? 'Update workout' : 'Save workout'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTERS */}
      <div className={styles.filterRow} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          {['All', ...TYPES].map(t => {
            const m = t !== 'All' ? META[t] : null
            return (
              <button
                key={t}
                className={`${styles.filterPill} ${filter === t ? styles.filterPillActive : ''}`}
                style={m
                  ? filter === t
                    ? { background: m.bg, borderColor: m.color, color: m.color }
                    : { borderColor: m.color + '60' }
                  : {}}
                onClick={() => setFilter(t)}
              >
                {m && <m.Icon size={14} weight="duotone" color={m.color} />}
                {t}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 600 }}>Filter Date:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className={styles.input}
            style={{ padding: '6px 12px', width: 'auto', minHeight: 36 }}
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')}
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <CircleNotch size={48} weight="bold" color="var(--text3)"
                style={{ animation: 'spin 1s linear infinite' }} />
            </div>
            <p>Loading your workouts…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Footprints size={48} weight="duotone" color="var(--text3)" />
            </div>
            <p>No workouts yet{filter !== 'All' ? ` for ${filter}` : ''}.</p>
            <button className={styles.btnSave} onClick={openAdd} style={{ marginTop: 20 }}>
              <Plus size={14} weight="bold" /> Add your first workout
            </button>
          </div>
        ) : (
          filtered.map(a => {
            const m   = META[a.type] || META.Other
            const tid = String(a.id || '').startsWith('temp_')
            return (
              <div key={a.id || a._id} className={styles.card} style={{ opacity: tid ? 0.5 : 1 }}>
                <div className={styles.cardBar} style={{ background: m.color }} />
                <div className={styles.cardIcon} style={{ background: m.bg }}>
                  <m.Icon size={22} weight="duotone" color={m.color} />
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{a.type}</div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTag} style={{ background: m.bg, color: m.color }}>{m.tag}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalendarBlank size={12} weight="duotone" color={m.color} />
                      {new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Timer size={12} weight="duotone" color={m.color} />
                      {a.duration} min
                    </span>
                    {a.notes && <span className={styles.cardNote}>· {a.notes}</span>}
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <div className={styles.cardCal}>
                    {a.calories ? `${Number(a.calories).toLocaleString()} kcal` : '—'}
                  </div>
                  {!tid && (
                    <div className={styles.cardActions}>
                      <button className={styles.actionBtn} onClick={() => handleEdit(a)} title="Edit">
                        <PencilSimple size={15} weight="duotone" color="var(--sage)" />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDel}`}
                        onClick={() => handleDelete(a.id || a._id)} title="Delete">
                        <Trash size={15} weight="duotone" color="var(--coral)" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}