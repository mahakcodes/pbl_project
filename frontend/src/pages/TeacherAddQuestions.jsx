import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/client'

const EMPTY_Q = { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', marks: 1, order: 1, explanation: '' }

export default function TeacherAddQuestions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(EMPTY_Q)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [t, qs] = await Promise.all([api.student.testDetail(id), api.teacher.questions(id)])
    setTest(t)
    setQuestions(qs)
    setForm(f => ({ ...f, order: qs.length + 1 }))
  }

  useEffect(() => { load() }, [id])

  const handleSave = async (addAnother = false) => {
    if (!form.question_text || !form.option_a || !form.option_b || !form.option_c || !form.option_d) {
      return showToast('Fill all fields', 'error')
    }
    setSaving(true)
    try {
      if (editId) {
        await api.teacher.editQuestion(editId, form)
        showToast('Question updated', 'success')
      } else {
        await api.teacher.addQuestion(id, form)
        showToast('Question added', 'success')
      }
      await load()
      setEditId(null)
      setForm({ ...EMPTY_Q, order: questions.length + 2 })
      if (!addAnother) navigate(`/teacher/tests/${id}/questions`)
    } catch { showToast('Failed to save', 'error') }
    finally { setSaving(false) }
  }

  const handleEdit = (q) => { setEditId(q.id); setForm(q) }

  const handleDelete = async (qid) => {
    if (!confirm('Delete this question?')) return
    await api.teacher.deleteQuestion(qid)
    showToast('Deleted', 'info')
    load()
  }

  const handlePublish = async () => {
    try {
      await api.teacher.publishTest(id)
      showToast('Test published!', 'success')
      navigate('/teacher/tests')
    } catch (err) { showToast(err.error || 'Cannot publish', 'error') }
  }

  return (
    <div className="add-questions-page">
      <div className="aq-header">
        <h2>{test?.title} — Add Questions</h2>
        <span className="q-progress">{questions.length} / {test?.num_questions} questions added</span>
      </div>

      {/* Form */}
      <div className="aq-form-card">
        <h3>{editId ? 'Edit Question' : 'New Question'}</h3>
        <div className="form-group">
          <label>Question Text</label>
          <textarea rows={3} value={form.question_text} onChange={e => setForm({ ...form, question_text: e.target.value })} />
        </div>
        <div className="options-grid">
          {['A', 'B', 'C', 'D'].map(opt => (
            <div key={opt} className="form-group">
              <label>Option {opt}</label>
              <input value={form[`option_${opt.toLowerCase()}`]} onChange={e => setForm({ ...form, [`option_${opt.toLowerCase()}`]: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Correct Option</label>
            <select value={form.correct_option} onChange={e => setForm({ ...form, correct_option: e.target.value })}>
              {['A', 'B', 'C', 'D'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Marks</label>
            <input type="number" min={1} value={form.marks} onChange={e => setForm({ ...form, marks: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Order</label>
            <input type="number" min={1} value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
          </div>
        </div>
        <div className="form-group">
          <label>Explanation (optional)</label>
          <input value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} />
        </div>
        <div className="aq-actions">
          <button className="btn-secondary" onClick={() => { setEditId(null); setForm(EMPTY_Q) }}>Clear</button>
          <button className="btn-outline" onClick={() => handleSave(true)} disabled={saving}>Save & Add Another</button>
          <button className="btn-primary" onClick={() => handleSave(false)} disabled={saving}>Save Question</button>
        </div>
      </div>

      {/* Questions List */}
      <div className="aq-list">
        <h3>Added Questions</h3>
        {questions.length === 0 && <p className="empty-state">No questions added yet</p>}
        {questions.map((q, i) => (
          <div key={q.id} className="aq-item">
            <div className="aq-item-info">
              <span className="q-num">Q{i + 1}</span>
              <span className="q-text">{q.question_text}</span>
              <span className="q-correct">✓ {q.correct_option}</span>
              <span className="q-marks">{q.marks}m</span>
            </div>
            <div className="aq-item-actions">
              <button className="btn-sm" onClick={() => handleEdit(q)}>Edit</button>
              <button className="btn-sm btn-danger-sm" onClick={() => handleDelete(q.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="aq-footer">
        <button className="btn-secondary" onClick={() => navigate('/teacher/tests')}>Back to Tests</button>
        <button className="btn-success" onClick={handlePublish} disabled={questions.length === 0}>
          Publish Test 🚀
        </button>
      </div>
    </div>
  )
}