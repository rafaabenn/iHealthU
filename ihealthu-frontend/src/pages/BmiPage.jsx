import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { calcBMI } from '../utils/bmiCalculator'
import '../styles/bmi.css'

export default function BmiPage() {
  const { user, setUser } = useAuth()
  // Initialize with user profile if available
  const [height, setHeight] = useState(user?.height || 170)
  const [weight, setWeight] = useState(user?.weight || 62)
  const [data, setData] = useState(() => calcBMI(height, weight))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setData(calcBMI(height, weight))
  }, [height, weight])

  const handleUpdateProfile = async () => {
    setSaving(true)
    setStatus('')
    try {
      const res = await api.put('/auth/profile', { height, weight })
      sessionStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(res.data.user)
      setStatus('✅ Profile updated!')
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setStatus('❌ Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const markerLeft = Math.min(Math.max((data.bmi - 10) / 30 * 100, 0), 100)

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="page-title-sm">Body mass index</div>
          <h1 className="page-title">⚖️ BMI <span>Calculator</span></h1>
        </div>
      </div>

      <div className="bmi-page-grid">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Your measurements</div>
          </div>
          <div className="range-slider-group">
            <div className="slider-label">
              <label className="form-label">Height</label>
              <span>{height} cm</span>
            </div>
            <input type="range" min="140" max="210" value={height}
              onChange={e => setHeight(Number(e.target.value))} />
          </div>
          <div className="range-slider-group">
            <div className="slider-label">
              <label className="form-label">Weight</label>
              <span>{weight} kg</span>
            </div>
            <input type="range" min="40" max="150" value={weight}
              onChange={e => setWeight(Number(e.target.value))} />
          </div>
          
          <button 
            onClick={handleUpdateProfile} 
            disabled={saving}
            style={{ 
              marginTop: 10,
              padding: '12px 20px', 
              borderRadius: 14, 
              border: '1px solid var(--border)', 
              background: 'var(--surface)', 
              color: 'var(--text1)', 
              fontWeight: 600, 
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--surface)'}
          >
            {saving ? 'Updating...' : '💾 Update My Profile'}
          </button>
          {status && <div style={{ marginTop: 8, fontSize: 13, textAlign: 'center', color: 'var(--text2)' }}>{status}</div>}

          <div className="bmi-info-grid" style={{ marginTop: 20 }}>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Healthy weight range</div>
              <div className="bmi-info-val">{data.range}</div>
            </div>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Ideal weight</div>
              <div className="bmi-info-val">{data.ideal}</div>
            </div>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Weight to adjust</div>
              <div className="bmi-info-val" style={{ color: data.diffColor }}>{data.diffText}</div>
            </div>
            <div className="bmi-info-card">
              <div className="bmi-info-label">Category</div>
              <div className="bmi-info-val" style={{ color: data.color }}>{data.category}</div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="bmi-result-box">
            <div className="bmi-result-num" style={{ color: data.color }}>{data.bmi.toFixed(1)}</div>
            <div className="bmi-result-cat" style={{ color: data.color }}>{data.category}</div>
          </div>
          <div className="bmi-scale">
            <div className="bmi-marker" style={{ left: `${markerLeft}%` }} />
          </div>
          <div className="bmi-scale-labels">
            <span>Underweight<br />&lt;18.5</span>
            <span>Normal<br />18.5–25</span>
            <span>Overweight<br />25–30</span>
            <span>Obese<br />&gt;30</span>
          </div>
          <div style={{ marginTop: 24, background: 'var(--bg)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>What does this mean?</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{data.advice}</div>
          </div>
        </div>
      </div>
    </div>
  )
}