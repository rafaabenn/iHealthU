import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import styles from '../styles/Profile.module.css'

const PRESET_AVATARS = [
  'https://api.dicebear.com/9.x/micah/svg?seed=Adrian',
  'https://api.dicebear.com/9.x/micah/svg?seed=Amaya',
  'https://api.dicebear.com/9.x/micah/svg?mouth=smile,laughing&seed=Riley',
  'https://api.dicebear.com/9.x/micah/svg?hair=dannyPhantom,fonze,full,pixie&hairColor=000000,77311d,9287ff,ac6651,e0ddff,f4d150,f9c9b6,fc909f,ffeba4&mouth=smile,laughing,smirk&seed=Adrian',
  'https://api.dicebear.com/9.x/micah/svg?hair=dannyPhantom,fonze,full,pixie&hairColor=000000,77311d,9287ff,ac6651,e0ddff,f4d150,f9c9b6,fc909f,ffeba4&mouth=smile,laughing,smirk&seed=Aidan',
  'https://api.dicebear.com/9.x/micah/svg?facialHair=beard&facialHairProbability=35&hair=dannyPhantom,fonze,full,pixie&hairColor=000000,77311d,9287ff,ac6651,e0ddff,f4d150,f9c9b6,fc909f,ffeba4&mouth=smile,laughing,smirk&seed=Sadie'
]

export default function Profile() {
  const { user, setUser } = useAuth()
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    avatar: ''
  })
  const [goalsForm, setGoalsForm] = useState({
    sleepHours: '',
    dailyWater: '',
    weeklyWorkouts: ''
  })
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingGoals, setSavingGoals] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        avatar: user.avatar || ''
      })
    }

    // Fetch current goals
    api.get('/goals')
      .then(res => {
        setGoalsForm({
          sleepHours: res.data.sleepHours || '',
          dailyWater: res.data.dailyWater || '',
          weeklyWorkouts: res.data.weeklyWorkouts || ''
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const handleProfileChange = e => setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleGoalsChange = e => setGoalsForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const showStatus = (type, message) => {
    setStatus({ type, message })
    setTimeout(() => setStatus({ type: '', message: '' }), 3000)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await api.put('/auth/profile', profileForm)
      // Update session storage and context
      sessionStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(res.data.user)
      showStatus('success', 'Profile updated successfully!')
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdateGoals = async (e) => {
    e.preventDefault()
    setSavingGoals(true)
    try {
      await api.put('/goals', goalsForm)
      showStatus('success', 'Goals updated successfully!')
    } catch (err) {
      showStatus('error', 'Failed to update goals')
    } finally {
      setSavingGoals(false)
    }
  }

  if (loading) return <div className="page-loading">Loading profile...</div>

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>👤 My <span>Profile</span></h1>
        <p className={styles.subtitle}>Manage your personal information and wellness targets</p>
      </header>

      <div className={styles.profileGrid}>
        <aside className={styles.sidebar}>
          <div className={styles.avatarCard}>
            <div className={styles.avatarWrapper}>
              <img
                src={user?.avatar || `https://api.dicebear.com/9.x/micah/svg?seed=Adrian`}
                alt="Avatar"
                className={styles.avatarImg}
              />
              <div className={styles.changeAvatarBtn}>📷</div>
            </div>
            <h2 className={styles.avatarName}>{user?.name}</h2>
            <p className={styles.avatarEmail}>{user?.email}</p>
          </div>

          {status.message && (
            <div className={`${styles.statusMessage} ${styles[status.type]}`}>
              {status.message}
            </div>
          )}
        </aside>

        <main className={styles.content}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>📝</span>
              <h2 className={styles.panelTitle}>Personal Information</h2>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className={styles.avatarPickerTitle}>Choose an avatar</div>
              <div className={styles.avatarPickerGrid}>
                {PRESET_AVATARS.map(url => (
                  <div
                    key={url}
                    className={`${styles.pickerOption} ${profileForm.avatar === url ? styles.selectedOption : ''}`}
                    onClick={() => setProfileForm(prev => ({ ...prev, avatar: url }))}
                  >
                    <img src={url} alt="preset" />
                  </div>
                ))}
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="Enter your name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <input
                    name="email"
                    value={profileForm.email}
                    disabled
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={profileForm.age}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="e.g. 25"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={profileForm.weight}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="e.g. 70"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={profileForm.height}
                    onChange={handleProfileChange}
                    className={styles.input}
                    placeholder="e.g. 180"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.btnPrimary}
                style={{ marginTop: 24 }}
                disabled={savingProfile}
              >
                {savingProfile ? 'Saving...' : 'Save Personal Info'}
              </button>
            </form>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelIcon}>🎯</span>
              <h2 className={styles.panelTitle}>Personal Goals</h2>
            </div>
            <form onSubmit={handleUpdateGoals}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Sleep Goal (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    name="sleepHours"
                    value={goalsForm.sleepHours}
                    onChange={handleGoalsChange}
                    className={styles.input}
                    placeholder="e.g. 8"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Water Goal (Litres)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="dailyWater"
                    value={goalsForm.dailyWater}
                    onChange={handleGoalsChange}
                    className={styles.input}
                    placeholder="e.g. 2.5"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Weekly Workout Goal</label>
                  <input
                    type="number"
                    name="weeklyWorkouts"
                    value={goalsForm.weeklyWorkouts}
                    onChange={handleGoalsChange}
                    className={styles.input}
                    placeholder="sessions per week"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.btnPrimary}
                style={{ marginTop: 24 }}
                disabled={savingGoals}
              >
                {savingGoals ? 'Saving...' : 'Save Goals'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
