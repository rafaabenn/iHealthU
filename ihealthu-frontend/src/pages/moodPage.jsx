import { useState } from 'react'
import '../styles/mood.css'

const moods = [
  { emoji: '😔', label: 'Sad' },
  { emoji: '😕', label: 'Meh' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😄', label: 'Happy' },
  { emoji: '🤩', label: 'Amazing' },
]

const initialLog = [
  { emoji: '😊', text: 'Good — felt energetic after yoga', date: 'Today' },
  { emoji: '🤩', text: 'Amazing — great workout day!', date: 'Yesterday' },
  { emoji: '😕', text: 'Meh — tired from little sleep', date: 'Mon 28 Apr' },
]

const weekHeights = [50, 70, 40, 65, 80, 55, 75]

export default function MoodPage() {
  const [selected, setSelected] = useState(2)
  const [note, setNote] = useState('')
  const [log, setLog] = useState(initialLog)

  const handleSave = () => {
    const m = moods[selected]
    const entry = {
      emoji: m.emoji,
      text: `${m.label}${note ? ` — ${note}` : ''}`,
      date: 'Just now',
    }
    setLog(prev => [entry, ...prev])
    setNote('')
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Mental wellness</div>
          <h1 className="page-title">😊 Mood <span>Logger</span></h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">How are you feeling today?</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Tap to select your mood</div>
          <div className="mood-big-row">
            {moods.map((m, idx) => (
              <div
                key={idx}
                className={`mood-big-btn ${idx === selected ? 'sel' : ''}`}
                onClick={() => setSelected(idx)}
              >
                <div>{m.emoji}</div>
                <div className="mood-big-label">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Add a note (optional)</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="What's on your mind today?"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleSave}
          >
            Save mood
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">This week's mood</div>
          </div>
          <div className="mood-week-chart">
            {weekHeights.map((h, i) => (
              <div key={i} className="mood-bar-wrap">
                <div className={`mood-bar ${i === 6 ? 'today' : ''}`} style={{ height: `${h}%` }} />
                <div className="mood-day-label">{['Mo','Tu','We','Th','Fr','Sa','Su'][i]}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="panel-title" style={{ marginBottom: 10, fontSize: 13 }}>Recent logs</div>
            <div className="mood-log-list">
              {log.map((entry, i) => (
                <div key={i} className="mood-log-item">
                  <div className="mood-log-emoji">{entry.emoji}</div>
                  <div className="mood-log-info">
                    <div className="mood-log-text">{entry.text}</div>
                    <div className="mood-log-date">{entry.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}