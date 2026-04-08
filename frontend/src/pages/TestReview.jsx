import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TestReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useApp()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.student.review(id, user.id)
      .then(setQuestions)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Loading review...</div>

  return (
    <div className="review-page">
      <div className="review-header">
        <button className="btn-secondary" onClick={() => navigate(`/student/tests/${id}/result`)}>← Back to Result</button>
        <h2>Answer Review</h2>
      </div>
      {questions.map((q, i) => (
        <div key={q.id} className={`review-card ${q.status}`}>
          <div className="review-q-header">
            <span>Q{i + 1}</span>
            <span className={`status-badge ${q.status}`}>
              {q.status === 'correct' ? '✅ Correct' : q.status === 'wrong' ? '❌ Wrong' : '➖ Not Attempted'}
            </span>
          </div>
          <p className="review-q-text">{q.question_text}</p>
          <div className="review-options">
            {['A', 'B', 'C', 'D'].map(opt => (
              <div key={opt} className={`review-option
                ${opt === q.correct_option ? 'review-correct' : ''}
                ${opt === q.selected_option && opt !== q.correct_option ? 'review-wrong' : ''}
              `}>
                <span className="opt-label">{opt}</span>
                <span>{q[`option_${opt.toLowerCase()}`]}</span>
                {opt === q.correct_option && <span className="tag">✓ Correct</span>}
                {opt === q.selected_option && opt !== q.correct_option && <span className="tag">Your answer</span>}
              </div>
            ))}
          </div>
          {q.explanation && <div className="explanation"><strong>Explanation:</strong> {q.explanation}</div>}
        </div>
      ))}
    </div>
  )
}