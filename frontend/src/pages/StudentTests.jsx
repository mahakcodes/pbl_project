import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function StudentTests() {
  const { setModal } = useApp()
  const [tests, setTests] = useState([])

  useEffect(() => {
    api.student.tests()
      .then(data => setTests(data || []))
      .catch(() => setTests([
        { id: 1, title: 'DSA - Mid Term', subject: 'DSA', scheduled_date: '2026-04-12', start_time: '10:00', end_time: '12:00', duration_minutes: 120, total_marks: 50, status: 'scheduled' },
        { id: 2, title: 'Python - Lab Test', subject: 'Python', scheduled_date: '2026-04-18', start_time: '09:00', end_time: '11:00', duration_minutes: 120, total_marks: 40, status: 'draft' },
      ]))
  }, [])

  return (
    <div className="test-cards-grid">
      {tests.map(test => (
        <div className="test-card" key={test.id}>
          <div className="test-card-header">
            <div><div className="test-card-title">{test.title}</div><div className="test-card-subject">{test.subject}</div></div>
            <span className={`status-badge ${test.status}`}><span className="status-dot"></span>{test.status.charAt(0).toUpperCase() + test.status.slice(1)}</span>
          </div>
          <div className="test-card-body">
            <div className="test-card-meta"><span className="meta-icon">📅</span>{new Date(test.scheduled_date).toLocaleDateString()}</div>
            <div className="test-card-meta"><span className="meta-icon">🕐</span>{test.start_time} - {test.end_time || 'TBD'}</div>
            <div className="test-card-meta"><span className="meta-icon">⏱</span>{test.duration_minutes} min</div>
            <div className="test-card-meta"><span className="meta-icon">📊</span>{test.total_marks} Marks</div>
          </div>
          <div className="test-card-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => setModal(<div className="modal-detail-grid"><div className="modal-detail-item full-width"><label>Test</label><span>{test.title}</span></div><div className="modal-detail-item"><label>Subject</label><span>{test.subject}</span></div><div className="modal-detail-item"><label>Marks</label><span>{test.total_marks}</span></div><div className="modal-detail-item"><label>Duration</label><span>{test.duration_minutes} min</span></div></div>)}>👁 View Details</button>
            <button className="btn btn-sm btn-disabled" style={{ background: 'var(--gray-100)', color: 'var(--gray-400)', border: '1px solid var(--gray-200)' }}>🚧 Take Test <span className="coming-soon-badge" style={{ marginLeft: '4px' }}>Coming Soon</span></button>
          </div>
        </div>
      ))}
    </div>
  )
}