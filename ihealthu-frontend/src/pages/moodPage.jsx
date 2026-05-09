import { useState } from 'react'
import '../styles/mood.css'
import { Smiley, SmileySad, SmileyMeh, SmileyWink, SmileySticker } from '@phosphor-icons/react'

const moods = [
  { Icon: SmileySad,     label: 'Sad',     color: '#6BA8C4' },
  { Icon: SmileyMeh,     label: 'Meh',     color: '#A0A0A0' },
  { Icon: Smiley,        label: 'Good',    color: '#4A7C6F' },
  { Icon: SmileyWink,    label: 'Happy',   color: '#E8A84A' },
  { Icon: SmileySticker, label: 'Amazing', color: '#E8715A' },
]

const initialLog = [
  { moodIndex: 2, text: 'Good — felt energetic after yoga', date: 'Today'       },
  { moodIndex: 4, text: 'Amazing — great workout day!',     date: 'Yesterday'   },
  { moodIndex: 1, text: 'Meh — tired from little sleep',    date: 'Mon 28 Apr'  },
]

const weekHeights = [50, 70, 40, 65, 80, 55, 75]

export default function MoodPage() {
  const [selected, setSelected] = useState(2)
  const [note, setNote]         = useState('')
  const [log, setLog]           = useState(initialLog)

  const handleSave = () => {
    const m = moods[selected]
    setLog(prev => [{
      moodIndex: selected,
      text: `${m.label}${note ? ` — ${note}` : ''}`,
      date: 'Just now',
    }, ...prev])
    setNote('')
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Mental wellness</div>
          <h1 className="page-title">
            <Smiley size={26} weight="duotone" color="var(--amber)"
              style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Mood <span>Logger</span>
          </h1>
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
                <m.Icon
                  size={32}
                  weight="duotone"
                  color={idx === selected ? m.color : 'var(--text3)'}
                />
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
              {log.map((entry, i) => {
                const m = moods[entry.moodIndex]
                return (
                  <div key={i} className="mood-log-item">
                    <div className="mood-log-emoji">
                      <m.Icon 
                      size={24} 
                      weight="duotone" 
                      color={m.color} />
                    </div>
                    <div className="mood-log-info">
                      <div className="mood-log-text">{entry.text}</div>
                      <div className="mood-log-date">{entry.date}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}