import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user, setModal } = useApp()
  const [stats, setStats] = useState({ active_tests: 0, upcoming_tests: 0, completed_tests: 0, total_tests: 0 })
  const [tests, setTests] = useState([])

  useEffect(() => {
    Promise.all([api.student.dashboard(), api.student.tests()])
      .then(([dashData, testsData]) => {
        setStats(dashData)
        setTests(testsData || [])
      })
      .catch(() => {
        // Fallback mock data for local dev if API isn't running
        setStats({ active_tests: 1, upcoming_tests: 3, completed_tests: 0, total_tests: 4 })
        setTests([
          { id: 1, title: 'DSA - Mid Term', subject: 'DSA', scheduled_date: '2026-04-12', start_time: '10:00', duration_minutes: 120, total_marks: 50, status: 'scheduled' },
          { id: 2, title: 'DBMS - Practical', subject: 'DBMS', scheduled_date: '2026-04-08', start_time: '14:00', duration_minutes: 90, total_marks: 30, status: 'scheduled' },
        ])
      })
  }, [])

  return (
    <div className="page">
      <div className="profile-card">
        <div className="profile-card-banner student-banner"></div>
        <div className="profile-card-body">
          <div className="profile-card-avatar student-avatar-large">{user?.first_name?.[0]}1</div>
          <div className="profile-card-info">
            <h3>{user?.first_name} {user?.last_name}</h3>
            <div className="profile-meta">
              <span className="profile-meta-item">🎓 Roll: {user?.roll_number}</span>
              <span className="profile-meta-item">🏫 {user?.department}</span>
              <span className="profile-meta-item">📧 {user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon green">📝</div></div>
          <div className="summary-card-value">{stats.active_tests}</div>
          <div className="summary-card-label">Active Tests</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon blue">📅</div></div>
          <div className="summary-card-value">{stats.upcoming_tests}</div>
          <div className="summary-card-label">Upcoming Tests</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon purple">✅</div></div>
          <div className="summary-card-value">{stats.completed_tests}</div>
          <div className="summary-card-label">Completed Tests</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon cyan">📊</div></div>
          <div className="summary-card-value">{stats.total_tests}</div>
          <div className="summary-card-label">Total Assigned</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3>📅 Upcoming Tests</h3>
          <span className="section-badge">{tests.length} Tests</span>
        </div>
        <div className="section-body">
          {tests.length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Test Name</th><th>Subject</th><th>Date</th><th>Time</th><th>Marks</th><th>Action</th></tr></thead>
              <tbody>
                {tests.map(test => (
                  <tr key={test.id}>
                    <td style={{ fontWeight: 600 }}>{test.title}</td>
                    <td>{test.subject}</td>
                    <td>{new Date(test.scheduled_date).toLocaleDateString()}</td>
                    <td>{test.start_time}</td>
                    <td>{test.total_marks}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal(<div className="modal-detail-grid"><div className="modal-detail-item full-width"><label>Test</label><span>{test.title}</span></div><div className="modal-detail-item"><label>Subject</label><span>{test.subject}</span></div><div className="modal-detail-item"><label>Marks</label><span>{test.total_marks}</span></div><div className="modal-detail-item"><label>Duration</label><span>{test.duration_minutes} min</span></div></div>)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>No upcoming tests</div>}
        </div>
      </div>
    </div>
  )
}