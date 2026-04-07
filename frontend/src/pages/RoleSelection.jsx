import { useNavigate } from 'react-router-dom'

export default function RoleSelection() {
  const navigate = useNavigate()
  return (
    <div className="role-selection">
      <div className="role-header">
        <div className="logo-icon">📝</div>
        <h1>Digital Test & Evaluation Portal</h1>
        <p>Select your role to continue</p>
      </div>
      <div className="role-cards-container">
        <div className="role-cards">
          <div className="role-card student" onClick={() => navigate('/student/login')}>
            <div className="role-card-icon">🎓</div>
            <h3>Student Login</h3>
            <p>Access your tests, view upcoming exams, and check your schedule</p>
            <div className="role-arrow">→</div>
          </div>
          <div className="role-card teacher" onClick={() => navigate('/teacher/login')}>
            <div className="role-card-icon">👨‍🏫</div>
            <h3>Teacher Login</h3>
            <p>Create tests, manage schedules, assign students, monitor progress</p>
            <div className="role-arrow">→</div>
          </div>
        </div>
      </div>
    </div>
  )
}