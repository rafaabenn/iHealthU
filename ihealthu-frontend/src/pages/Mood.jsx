import { useState, useEffect } from 'react'
import api from '../services/api'
import styles from '../styles/Mood.module.css'
import {
  SmileySticker, Smiley, SmileyBlank, SmileySad, SmileyAngry, PencilSimple
} from '@phosphor-icons/react'

const MOODS = [
  { Icon: SmileySticker, label: 'Amazing', color: '#ffd700' },
  { Icon: Smiley,        label: 'Good',    color: '#a8d5c2' },
  { Icon: SmileyBlank,   label: 'Okay',    color: '#d1d1d6' },
  { Icon: SmileySad,     label: 'Sad',     color: '#a29bfe' },
  { Icon: SmileyAngry,   label: 'Angry',   color: '#ff7675' },
]

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote]                 = useState('')
  const [history, setHistory]           = useState({})
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]

  useEffect(() => { fetchMoodData() }, [])

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

  const [saveMsg, setSaveMsg] = useState('')

  const showToast = (msg) => {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleSave = async () => {
    if (!selectedMood) return
    setSaving(true)
    try {
      const res = await api.post('/mood', { date: todayStr, mood: selectedMood, note })
      setHistory(prev => ({ ...prev, [todayStr]: res.data }))
      showToast("Today's mood saved!")
    } catch (err) {
      console.error('Failed to save mood', err)
      showToast('Failed to save mood. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>
      Loading emotional data...
    </div>
  )

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
              style={selectedMood === m.label
                ? { borderColor: m.color, boxShadow: `0 4px 16px ${m.color}44` }
                : {}}
            >
              <m.Icon
                size={36}
                weight="duotone"
                color={m.color}
                className={styles.emoji}
              />
              <span
                className={styles.moodLabel}
                style={selectedMood === m.label ? { color: m.color, fontWeight: 700 } : {}}
              >
                {m.label}
              </span>
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
          {saving ? 'Saving...' : "Save Today's Mood"}
        </button>

        {saveMsg && (
          <div style={{
            marginTop: 12,
            padding: '10px 16px',
            borderRadius: 10,
            background: saveMsg.includes('Failed') ? 'rgba(232,93,58,0.12)' : 'rgba(74,124,111,0.12)',
            color: saveMsg.includes('Failed') ? 'var(--coral)' : 'var(--sage)',
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'center',
            border: `1px solid ${saveMsg.includes('Failed') ? 'rgba(232,93,58,0.3)' : 'rgba(74,124,111,0.3)'}`,
          }}>
            {saveMsg.includes('Failed') ? '✗' : '✓'} {saveMsg}
          </div>
        )}
      </div>

      <section className={styles.historySection}>
        <h2 className={styles.historyTitle}>Recent Moods</h2>
        <div className={styles.historyGrid}>
          {last7Days.map(date => {
            const entry   = history[date]
            const d       = new Date(date)
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
            const dayNum  = d.getDate()
            const moodObj = entry ? MOODS.find(m => m.label === entry.mood) : null

            return (
              <div
                key={date}
                className={`${styles.historyDay} ${entry?.note ? styles.hasNote : ''}`}
                style={{ opacity: date > todayStr ? 0.3 : 1 }}
                title={entry?.note || 'No note'}
              >
                <span className={styles.dayName}>{dayName} {dayNum}</span>
                <span className={styles.dayEmoji}>
                  {moodObj
                    ? <moodObj.Icon size={24} weight="duotone" color={moodObj.color} />
                    : '—'
                  }
                </span>
                {entry?.note && (
                  <div className={styles.notePreview}>
                    <PencilSimple size={13} weight="duotone" color="var(--text3)" className={styles.noteIcon} />
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