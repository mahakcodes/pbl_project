import { useApp } from '../context/AppContext'

// Mock data for Phase 1 (Backend endpoint for student list not built yet)
const MOCK_STUDENTS = [
  { id: 1, name: 'Student 1', regNo: 'CS2022001', department: 'Computer Science', email: 'student@college.edu', testsTaken: 0, testsPending: 3, avgMarks: '-', status: 'Active' }
]

export default function TeacherStudentList() {
  return (
    <div className="section">
      <div className="section-header">
        <h3>👥 Enrolled Students</h3>
        <span className="section-badge">{MOCK_STUDENTS.length} Student</span>
      </div>
      <div className="section-body">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Reg. No</th><th>Department</th><th>Email</th><th>Tests Taken</th><th>Pending</th><th>Avg. Marks</th><th>Status</th></tr>
          </thead>
          <tbody>
            {MOCK_STUDENTS.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.regNo}</td>
                <td>{s.department}</td>
                <td>{s.email}</td>
                <td>{s.testsTaken}</td>
                <td>{s.testsPending}</td>
                <td>{s.avgMarks}</td>
                <td><span className={`status-badge active`}><span className="status-dot"></span>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}