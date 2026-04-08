import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TeacherLogin() {
  const navigate = useNavigate()
  const { showToast, setUser } = useApp()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await api.auth.login({ identifier: identifier, password })

      console.log('✅ Login successful, user data:', userData)

      if (!userData || !userData.role) {
        throw new Error('Invalid response from server')
      }

      // ✅ Optional: ensure teacher login
      if (userData.role !== 'teacher') {
        throw new Error('You are not a teacher')
      }

      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))

      showToast('Welcome back!', 'success')
      navigate('/teacher/dashboard')

    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page teacher-bg">
      <div className="login-card teacher">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>

        <div className="login-icon">👨‍🏫</div>
        <h2>Teacher Login</h2>
        <p className="login-subtitle">Enter your credentials to access the portal</p>

        {error && <div className="login-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Employee ID</label>
            <input
              type="text"
              placeholder="Enter email or employee ID"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn teacher-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}