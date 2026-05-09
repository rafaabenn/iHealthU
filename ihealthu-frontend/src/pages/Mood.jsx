import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/Mood.module.css'

const MOODS = [
  { emoji: '🤩', label: 'Amazing', color: '#ffd700' },
  { emoji: '😊', label: 'Good',    color: '#a8d5c2' },
  { emoji: '😐', label: 'Okay',    color: '#d1d1d6' },
  { emoji: '😔', label: 'Sad',     color: '#a29bfe' },
  { emoji: '😡', label: 'Angry',   color: '#ff7675' },
]

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [history, setHistory] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchMoodData()
  }, [])

  const fetchMoodData = async () => {
    try {
      const [historyRes, todayRes] = await Promise.all([
        api.get('/mood'),
        api.get('/mood/today')
      ])
      setHistory(historyRes.data)
      if (todayRes.data) {
        setSelectedMood(todayRes.data.mood)
        setNote(todayRes.data.note)
      }
    } catch (err) {
      console.error('Failed to fetch mood data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedMood) return
    setSaving(true)
    try {
      const res = await api.post('/mood', {
        date: todayStr,
        mood: selectedMood,
        note
      })
      setHistory(prev => ({ ...prev, [todayStr]: res.data }))
      alert('Mood saved for today! ✨')
    } catch (err) {
      console.error('Failed to save mood', err)
    } finally {
      setSaving(false)
    }
  }

  // Get last 7 days for the history grid
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  if (loading) return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Loading emotional data...</div>

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.subtitle}>Daily Check-in</div>
        <h1 className={styles.title}>How are you <span>feeling</span>?</h1>
      </header>

      <div className={styles.mainCard}>
        <p className={styles.question}>Select your mood for today</p>
        
        <div className={styles.moodGrid}>
          {MOODS.map(m => (
            <button
              key={m.label}
              className={`${styles.moodBtn} ${selectedMood === m.label ? styles.selected : ''}`}
              onClick={() => setSelectedMood(m.label)}
            >
              <span className={styles.emoji}>{m.emoji}</span>
              <span className={styles.moodLabel}>{m.label}</span>
            </button>
          ))}
        </div>

        <textarea
          className={styles.noteArea}
          placeholder="What's on your mind? (Optional)"
          rows="3"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <button 
          className={styles.btnSave} 
          onClick={handleSave}
          disabled={saving || !selectedMood}
        >
          {saving ? 'Saving...' : 'Save Today\'s Mood'}
        </button>
      </div>

      <section className={styles.historySection}>
        <h2 className={styles.historyTitle}>Recent Moods</h2>
        <div className={styles.historyGrid}>
          {last7Days.map(date => {
            const entry = history[date]
            const d = new Date(date)
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
            const dayNum = d.getDate()
            const moodObj = entry ? MOODS.find(m => m.label === entry.mood) : null

            return (
              <div 
                key={date} 
                className={`${styles.historyDay} ${entry?.note ? styles.hasNote : ''}`} 
                style={{ opacity: date > todayStr ? 0.3 : 1 }}
                title={entry?.note || 'No note'}
              >
                <span className={styles.dayName}>{dayName} {dayNum}</span>
                <span className={styles.dayEmoji}>{moodObj ? moodObj.emoji : '—'}</span>
                {entry?.note && (
                  <div className={styles.notePreview}>
                    <span className={styles.noteIcon}>📝</span>
                    <div className={styles.noteTooltip}>{entry.note}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
