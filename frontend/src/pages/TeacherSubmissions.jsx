import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function TeacherSubmissions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.teacher.submissions(id).then(setSubmissions).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Loading submissions...</div>

  const submitted = submissions.filter(s => s.status === 'submitted')

  return (
    <div className="submissions-page">
      <div className="page-header">
        <button className="btn-secondary" onClick={() => navigate('/teacher/tests')}>← Back</button>
        <h2>Student Submissions</h2>
        <span>{submitted.length} / {submissions.length} submitted</span>
      </div>
      <div className="submissions-table-wrap">
        <table className="submissions-table">
          <thead>
            <tr><th>Student</th><th>Roll No</th><th>Status</th><th>Submitted At</th><th>Marks</th><th>%</th></tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={i}>
                <td>{s.student_name}</td>
                <td>{s.roll_number}</td>
                <td><span className={`status-badge ${s.status}`}>{s.status}</span></td>
                <td>{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '—'}</td>
                <td>{s.marks_obtained ?? '—'}</td>
                <td>{s.percentage != null ? `${s.percentage}%` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}