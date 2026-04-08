import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TestAttempt() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, showToast } = useApp()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [qs, detail] = await Promise.all([
          api.student.questions(id, user.id),
          api.student.testDetail(id)
        ])
        setQuestions(qs)
        setTimeLeft(detail.duration_minutes * 60)
      } catch { showToast('Failed to load test', 'error') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) { handleSubmit(true); return }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [timeLeft])

  const handleAnswer = async (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
    try { await api.student.saveAnswer(id, user.id, questionId, option) } catch {}
  }

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return
    setSubmitting(true)
    clearTimeout(timerRef.current)
    try {
      await api.student.submitTest(id, user.id, auto)
      showToast('Test submitted!', 'success')
      navigate(`/student/tests/${id}/result`)
    } catch (err) {
      showToast(err.error || 'Submission failed', 'error')
      setSubmitting(false)
    }
  }, [submitting, id, user])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const answered = Object.keys(answers).length
  const q = questions[current]

  if (loading) return <div className="loading">Loading test...</div>

  return (
    <div className="attempt-page">
      {/* Header */}
      <div className="attempt-header">
        <div className="attempt-title">
          <h3>Test in Progress</h3>
          <span>{answered}/{questions.length} answered</span>
        </div>
        <div className={`timer ${timeLeft < 60 ? 'timer-danger' : timeLeft < 300 ? 'timer-warning' : ''}`}>
          ⏱ {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
        </div>
        <button className="btn-danger" onClick={() => setShowConfirm(true)} disabled={submitting}>
          Submit Test
        </button>
      </div>

      <div className="attempt-body">
        {/* Question Panel */}
        <div className="question-panel">
          {q && (
            <>
              <div className="question-header">
                <span>Question {current + 1} of {questions.length}</span>
                <span>{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
              </div>
              <p className="question-text">{q.question_text}</p>
              <div className="options-list">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <button
                    key={opt}
                    className={`option-btn ${answers[q.id] === opt ? 'selected' : ''}`}
                    onClick={() => handleAnswer(q.id, opt)}
                  >
                    <span className="opt-label">{opt}</span>
                    <span>{q[`option_${opt.toLowerCase()}`]}</span>
                  </button>
                ))}
              </div>
              <div className="question-nav-btns">
                <button className="btn-secondary" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>← Previous</button>
                <button className="btn-outline" onClick={() => handleAnswer(q.id, '')}>Clear</button>
                <button className="btn-primary" onClick={() => setCurrent(c => c + 1)} disabled={current === questions.length - 1}>Next →</button>
              </div>
            </>
          )}
        </div>

        {/* Question Navigator */}
        <div className="question-navigator">
          <h4>Questions</h4>
          <div className="nav-grid">
            {questions.map((q, i) => (
              <button
                key={q.id}
                className={`nav-btn ${i === current ? 'nav-current' : answers[q.id] ? 'nav-answered' : 'nav-unanswered'}`}
                onClick={() => setCurrent(i)}
              >{i + 1}</button>
            ))}
          </div>
          <div className="nav-legend">
            <span className="legend-answered">■ Answered</span>
            <span className="legend-unanswered">■ Not answered</span>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Submit Test?</h3>
            <p>Answered: <strong>{answered}</strong> / {questions.length}</p>
            <p>Unanswered: <strong>{questions.length - answered}</strong></p>
            <p>Once submitted, you cannot reattempt.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowConfirm(false)}>Go Back</button>
              <button className="btn-danger" onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}