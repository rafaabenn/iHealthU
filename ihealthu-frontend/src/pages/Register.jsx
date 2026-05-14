import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Auth.module.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    setErrors({})
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo1.png" alt="logo" style={{ width: '35px', height: '35px', margin: '5px' }} />
          iHealth<span>U</span>
        </div>
        <p className={styles.authSubtitle}>Create your wellness account</p>

        {errors.general && <div className={styles.errorBanner}>{errors.general}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="GHAMMAD AYA " />
            {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="you@example.com" />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Min 6 characters" />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm password</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
              className={`${styles.input} ${errors.confirm ? styles.inputError : ''}`}
              placeholder="••••••••" />
            {errors.confirm && <span className={styles.fieldError}>{errors.confirm}</span>}
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className={styles.authFooter}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}