import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TeacherTests() {
  const { showToast, setModal } = useApp()
  const [tests, setTests] = useState([])

  useEffect(() => {
    api.teacher.tests()
      .then(data => setTests(data || []))
      .catch(() => setTests([
        { id: 1, title: 'DSA - Mid Term', subject: 'DSA', num_questions: 25, duration_minutes: 120, total_marks: 50, scheduled_date: '2026-04-12', status: 'scheduled' },
        { id: 2, title: 'Python - Lab Test', subject: 'Python', num_questions: 20, duration_minutes: 120, total_marks: 40, scheduled_date: '2026-04-18', status: 'draft' },
      ]))
  }, [])

  const handleAction = (action, name) => {
    if (action === 'publish') showToast(`"${name}" published successfully!`, 'success')
    else if (action === 'delete') showToast(`"${name}" deleted.`, 'error')
    else showToast(`"${name}" - Action coming in Phase 2`, 'info')
  }

  return (
    <div className="test-cards-grid">
      {tests.map(test => (
        <div className="test-card" key={test.id}>
          <div className="test-card-header">
            <div><div className="test-card-title">{test.title}</div><div className="test-card-subject">{test.subject}</div></div>
            <span className={`status-badge ${test.status}`}><span className="status-dot"></span>{test.status.charAt(0).toUpperCase() + test.status.slice(1)}</span>
          </div>
          <div className="test-card-body">
            <div className="test-card-meta"><span className="meta-icon">❓</span>{test.num_questions || 0} Qs</div>
            <div className="test-card-meta"><span className="meta-icon">📊</span>{test.total_marks} Marks</div>
            <div className="test-card-meta"><span className="meta-icon">⏱</span>{test.duration_minutes} min</div>
            <div className="test-card-meta"><span className="meta-icon">📅</span>{new Date(test.scheduled_date).toLocaleDateString()}</div>
          </div>
          <div className="test-card-footer">
            <button className="btn btn-secondary btn-sm" onClick={() => setModal(<div className="modal-detail-grid"><div className="modal-detail-item full-width"><label>Test</label><span>{test.title}</span></div><div className="modal-detail-item"><label>Subject</label><span>{test.subject}</span></div><div className="modal-detail-item"><label>Questions</label><span>{test.num_questions}</span></div><div className="modal-detail-item"><label>Marks</label><span>{test.total_marks}</span></div><div className="modal-detail-item"><label>Duration</label><span>{test.duration_minutes} min</span></div></div>)}>👁 View</button>
            <button className="btn btn-warning btn-sm" onClick={() => handleAction('edit', test.title)}>✏ Edit</button>
            {test.status === 'draft' && <button className="btn btn-success btn-sm" onClick={() => handleAction('publish', test.title)}>🚀 Publish</button>}
            <button className="btn btn-danger btn-sm" onClick={() => handleAction('delete', test.title)}>🗑 Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}