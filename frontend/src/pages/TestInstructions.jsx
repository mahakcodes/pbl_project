import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

export default function TestInstructions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, showToast } = useApp()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.student.testDetail(id)
      .then(setTest)
      .catch(() => showToast('Failed to load test', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStart = async () => {
    try {
      await api.student.startTest(id, user.id)
      navigate(`/student/tests/${id}/attempt`)
    } catch (err) {
      showToast(err.error || 'Cannot start test', 'error')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!test) return <div className="loading">Test not found</div>

  return (
    <div className="instructions-page">
      <div className="instructions-card">
        <h2>{test.title}</h2>
        <p className="subject-tag">{test.subject}</p>

        <div className="info-grid">
          <div className="info-item"><span>Total Questions</span><strong>{test.num_questions}</strong></div>
          <div className="info-item"><span>Total Marks</span><strong>{test.total_marks}</strong></div>
          <div className="info-item"><span>Duration</span><strong>{test.duration_minutes} mins</strong></div>
          <div className="info-item"><span>Date</span><strong>{test.scheduled_date}</strong></div>
          <div className="info-item"><span>Start Time</span><strong>{test.start_time}</strong></div>
          <div className="info-item"><span>End Time</span><strong>{test.end_time}</strong></div>
        </div>

        {test.description && <div className="test-description"><h4>Instructions</h4><p>{test.description}</p></div>}

        <div className="rules-box">
          <h4>⚠ Important Rules</h4>
          <ul>
            <li>Do not refresh or close the browser during the test</li>
            <li>Timer will auto-submit when time runs out</li>
            <li>You can attempt this test only once</li>
            <li>All questions are MCQ with single correct answer</li>
          </ul>
        </div>

        <div className="instructions-actions">
          <button className="btn-secondary" onClick={() => navigate('/student/tests')}>Back</button>
          <button className="btn-primary" onClick={handleStart}>Start Test Now →</button>
        </div>
      </div>
    </div>
  )
}