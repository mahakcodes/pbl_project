import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TestResult() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useApp()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.student.result(id, user.id)
      .then(setResult)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Loading result...</div>
  if (!result) return <div className="loading">Result not found</div>

  const passed = result.percentage >= 40

  return (
    <div className="result-page">
      <div className="result-card">
        <div className={`result-badge ${passed ? 'pass' : 'fail'}`}>{passed ? '🎉 Pass' : '❌ Fail'}</div>
        <h2>{result.test_title}</h2>
        <p className="subject-tag">{result.subject}</p>

        <div className="score-circle">
          <span className="score-main">{result.marks_obtained}</span>
          <span className="score-total">/ {result.total_marks}</span>
          <span className="score-pct">{result.percentage}%</span>
        </div>

        <div className="result-grid">
          <div className="result-item correct">✅ Correct<strong>{result.correct_answers}</strong></div>
          <div className="result-item wrong">❌ Wrong<strong>{result.wrong_answers}</strong></div>
          <div className="result-item unanswered">➖ Skipped<strong>{result.unanswered}</strong></div>
          <div className="result-item">📊 Class Avg<strong>{result.class_average}</strong></div>
          <div className="result-item">🏆 Highest<strong>{result.highest_marks}</strong></div>
          <div className="result-item">📉 Lowest<strong>{result.lowest_marks}</strong></div>
        </div>

        <div className="result-actions">
          <button className="btn-secondary" onClick={() => navigate('/student/tests')}>Back to Tests</button>
          <button className="btn-primary" onClick={() => navigate(`/student/tests/${id}/review`)}>View Answer Review →</button>
        </div>
      </div>
    </div>
  )
}