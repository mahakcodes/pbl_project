import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function StudentLogin() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📝 Form submitted with:', { identifier, password })
    setError('')
    setLoading(true)
    try {
      console.log('🚀 Calling API...')
      const userData = await api.auth.login({ identifier, password })
      console.log('✅ Login successful:', userData)
      
      if (!userData || !userData.role) {
        throw new Error('Invalid response from server')
      }
      
      showToast('Welcome back!', 'success')
      console.log('🔄 Navigating to dashboard...')
      navigate('/student/dashboard')
    } catch (err) {
      console.error('❌ Login failed:', err)
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page student-bg">
      <div className="login-card student">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <div className="login-icon">🎓</div>
        <h2>Student Login</h2>
        <p className="login-subtitle">Enter your credentials to access the portal</p>
        {error && <div className="login-error">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Roll Number</label>
            <input 
              type="text" 
              placeholder="Enter email or roll number" 
              value={identifier} 
              onChange={e => {
                console.log('📝 Identifier changed:', e.target.value)
                setIdentifier(e.target.value)
              }} 
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
          <button type="submit" className="login-btn student-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}