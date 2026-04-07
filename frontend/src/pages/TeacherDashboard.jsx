import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TeacherDashboard() {
  const { user } = useApp()
  const [stats, setStats] = useState({ total_tests: 0, scheduled_tests: 0, draft_tests: 0, total_students_assigned: 0 })
  const [recentTests, setRecentTests] = useState([])

  useEffect(() => {
    Promise.all([api.teacher.dashboard(), api.teacher.tests()])
      .then(([dashData, testsData]) => {
        setStats(dashData)
        setRecentTests((testsData || []).slice(0, 5))
      })
      .catch(() => {
        setStats({ total_tests: 3, scheduled_tests: 2, draft_tests: 1, total_students_assigned: 1 })
        setRecentTests([
          { id: 1, title: 'DSA - Mid Term', subject: 'DSA', num_questions: 25, total_marks: 50, scheduled_date: '2026-04-12', status: 'scheduled' },
        ])
      })
  }, [])

  return (
    <div className="page">
      <div className="profile-card">
        <div className="profile-card-banner teacher-banner"></div>
        <div className="profile-card-body">
          <div className="profile-card-avatar teacher-avatar-large">{user?.first_name?.[0]}1</div>
          <div className="profile-card-info">
            <h3>{user?.first_name} {user?.last_name}</h3>
            <div className="profile-meta">
              <span className="profile-meta-item">👨‍🏫 ID: {user?.employee_id}</span>
              <span className="profile-meta-item">🏫 {user?.department}</span>
              <span className="profile-meta-item">📧 {user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon purple">📋</div></div>
          <div className="summary-card-value">{stats.total_tests}</div>
          <div className="summary-card-label">Total Tests Created</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon blue">📅</div></div>
          <div className="summary-card-value">{stats.scheduled_tests}</div>
          <div className="summary-card-label">Scheduled Tests</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon orange">📝</div></div>
          <div className="summary-card-value">{stats.draft_tests}</div>
          <div className="summary-card-label">Draft Tests</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-header"><div className="summary-card-icon green">👥</div></div>
          <div className="summary-card-value">{stats.total_students_assigned}</div>
          <div className="summary-card-label">Students Assigned</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h3>📋 Recent Tests</h3>
          <span className="section-badge">{recentTests.length} Tests</span>
        </div>
        <div className="section-body">
          {recentTests.length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Test Name</th><th>Subject</th><th>Questions</th><th>Marks</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {recentTests.map(test => (
                  <tr key={test.id}>
                    <td style={{ fontWeight: 600 }}>{test.title}</td>
                    <td>{test.subject}</td>
                    <td>{test.num_questions || '-'}</td>
                    <td>{test.total_marks}</td>
                    <td>{new Date(test.scheduled_date).toLocaleDateString()}</td>
                    <td><span className={`status-badge ${test.status}`}><span className="status-dot"></span>{test.status.charAt(0).toUpperCase() + test.status.slice(1)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>No tests created yet</div>}
        </div>
      </div>
    </div>
  )
}