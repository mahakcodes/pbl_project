import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function TeacherAnalytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.teacher.analytics(id).then(setData).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Loading analytics...</div>
  if (!data) return <div className="loading">No data</div>

  return (
    <div className="analytics-page">
      <div className="page-header">
        <button className="btn-secondary" onClick={() => navigate('/teacher/tests')}>← Back</button>
        <h2>Test Analytics</h2>
      </div>
      <div className="analytics-grid">
        <div className="stat-card">👥 Assigned<strong>{data.total_assigned}</strong></div>
        <div className="stat-card">✅ Attempted<strong>{data.total_attempted}</strong></div>
        <div className="stat-card">❌ Not Attempted<strong>{data.not_attempted}</strong></div>
        <div className="stat-card">📊 Average<strong>{data.average_marks}</strong></div>
        <div className="stat-card">🏆 Highest<strong>{data.highest_marks}</strong></div>
        <div className="stat-card">📉 Lowest<strong>{data.lowest_marks}</strong></div>
        <div className="stat-card">🎯 Pass %<strong>{data.pass_percentage}%</strong></div>
      </div>

      <h3>Question-wise Analysis</h3>
      <table className="analytics-table">
        <thead><tr><th>#</th><th>Question</th><th>Correct</th><th>Correctness %</th></tr></thead>
        <tbody>
          {data.question_analysis.map((q, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{q.question_text}</td>
              <td>{q.correct_count} / {q.total_attempted}</td>
              <td>
                <div className="progress-bar"><div style={{ width: `${q.correctness_pct}%` }} /></div>
                {q.correctness_pct}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}