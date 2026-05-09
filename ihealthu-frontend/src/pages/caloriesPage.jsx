import { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import '../styles/calories.css'

const ACTIVITY_METS = [
  { label: '🚶 Walking',      met: 4 },
  { label: '🏃 Running',      met: 7 },
  { label: '🚴 Cycling',      met: 8 },
  { label: '🧘 Yoga',         met: 6 },
  { label: '🏊 Swimming',     met: 9 },
  { label: '🏋️ HIIT',        met: 10 },
]

export default function CaloriesPage() {
  const [met, setMet]           = useState(7)
  const [duration, setDuration] = useState(45)
  const [weight, setWeight]     = useState(62)
  const [saving, setSaving]     = useState(false)
  const [status, setStatus]     = useState('')
  const navigate = useNavigate()

  // MET formula: Calories = MET × weight(kg) × duration(hours)
  const calories = Math.round(met * weight * (duration / 60))

  const handleLogWorkout = async () => {
    setSaving(true)
    setStatus('')
    
    // Find the type label based on MET
    const activity = ACTIVITY_METS.find(a => a.met === met)
    // Extract string without the emoji
    const typeLabel = activity ? activity.label.split(' ')[1] : 'Other'

    const payload = {
      type: typeLabel,
      duration: duration,
      calories: calories,
      date: new Date().toISOString().split('T')[0],
      notes: 'Logged from Calorie Estimator'
    }

    try {
      await api.post('/activities', payload)
      setStatus('✅ Workout saved successfully!')
      setTimeout(() => navigate('/dashboard/activities'), 1500)
    } catch (error) {
      setStatus('❌ Failed to save workout')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Energy expenditure</div>
          <h1 className="page-title">🔥 Calorie <span>Estimator</span></h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Left panel — inputs */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Estimate calories burned</div>
          </div>
          <div className="form-group">
            <label className="form-label">Exercise type</label>
            <select
              className="form-input form-select"
              value={met}
              onChange={e => setMet(Number(e.target.value))}
            >
              {ACTIVITY_METS.map(a => (
                <option key={a.label} value={a.met}>{a.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Body weight (kg)</label>
            <input
              className="form-input"
              type="number"
              min="30"
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
            />
          </div>

          {/* Result display */}
          <div style={{
            background: 'linear-gradient(135deg, var(--forest), var(--sage))',
            borderRadius: 16, padding: 20, textAlign: 'center', marginTop: 8
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
              Estimated calories burned
            </div>
            <div style={{ fontSize: 52, fontWeight: 700, color: '#fff', letterSpacing: -2 }}>
              {calories}
            </div>
            <div style={{ fontSize: 13, color: 'var(--mint)' }}>
              kcal in {duration} minutes
            </div>
            <button 
              onClick={handleLogWorkout} 
              disabled={saving}
              style={{ 
                marginTop: 20, 
                padding: '10px 20px', 
                borderRadius: 20, 
                border: 'none', 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'background 0.2s',
                width: '100%'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              {saving ? 'Saving...' : '➕ Log as Workout'}
            </button>
            {status && <div style={{ marginTop: 10, fontSize: 13, color: 'white' }}>{status}</div>}
          </div>
        </div>

        {/* Right panel — formula explanation */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">How it's calculated</div>
          </div>

          {/* 3 input summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
            {[
              { label: 'MET value', val: met },
              { label: 'Weight',    val: `${weight} kg` },
              { label: 'Duration',  val: `${duration} min` },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--bg)', borderRadius: 10,
                padding: '10px 12px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{item.val}</div>
              </div>
            ))}
          </div>

          <div style={{
            padding: 16, background: 'var(--bg)',
            borderRadius: 12, fontSize: 13, color: 'var(--text2)', lineHeight: 1.7
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>The MET formula</div>
            <p>Calories = MET × weight (kg) × duration (h)</p>
            <p style={{ marginTop: 8 }}>
              MET (Metabolic Equivalent of Task) measures how much energy an activity burns
              compared to sitting at rest (MET = 1).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}