import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function TeacherCreateTest() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [form, setForm] = useState({ testName: '', subject: '', numQuestions: '', totalMarks: '', duration: '', durationUnit: 'Hours', scheduledDate: '', startTime: '', endTime: '', description: '' })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.testName || !form.subject || !form.totalMarks) {
      showToast('Please fill required fields', 'error')
      return
    }
    showToast(`Test "${form.testName}" created as draft!`, 'success')
    setForm({ testName: '', subject: '', numQuestions: '', totalMarks: '', duration: '', durationUnit: 'Hours', scheduledDate: '', startTime: '', endTime: '', description: '' })
    setTimeout(() => navigate(`/teacher/tests/${newTest.id}/add-questions`), 800)
  }

  return (
    <div className="create-test-form">
      <h3>📝 Create New Test</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row single"><div className="form-field"><label>Test Name *</label><input type="text" name="testName" placeholder="e.g. DSA - Mid Term" value={form.testName} onChange={handleChange} required /></div></div>
        <div className="form-row">
          <div className="form-field"><label>Subject *</label><input type="text" name="subject" placeholder="e.g. Data Structures" value={form.subject} onChange={handleChange} required /></div>
          <div className="form-field"><label>Total Marks *</label><input type="number" name="totalMarks" placeholder="e.g. 50" value={form.totalMarks} onChange={handleChange} required /></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label>Questions</label><input type="number" name="numQuestions" placeholder="e.g. 25" value={form.numQuestions} onChange={handleChange} /></div>
          <div className="form-field"><label>Duration</label><div style={{ display: 'flex', gap: '8px' }}><input type="number" name="duration" placeholder="e.g. 2" value={form.duration} onChange={handleChange} style={{ flex: 1 }} /><select name="durationUnit" value={form.durationUnit} onChange={handleChange}><option value="Minutes">Minutes</option><option value="Hours">Hours</option></select></div></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label>Date</label><input type="date" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} /></div>
          <div className="form-field"><label>Start Time</label><input type="time" name="startTime" value={form.startTime} onChange={handleChange} /></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label>End Time</label><input type="time" name="endTime" value={form.endTime} onChange={handleChange} /></div>
        </div>
        <div className="form-row single"><div className="form-field"><label>Description / Instructions</label><textarea name="description" rows="3" placeholder="Enter test instructions..." value={form.description} onChange={handleChange} style={{ resize: 'vertical' }}></textarea></div></div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-success">Create Test</button>
        </div>
      </form>
    </div>
  )
}