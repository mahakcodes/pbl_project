import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import RoleSelection from './pages/RoleSelection'
import StudentLogin from './pages/StudentLogin'
import TeacherLogin from './pages/TeacherLogin'
import StudentDashboard from './pages/StudentDashboard'
import StudentTests from './pages/StudentTests'
import TestInstructions from './pages/TestInstructions'
import TestAttempt from './pages/TestAttempt'
import TestResult from './pages/TestResult'
import TestReview from './pages/TestReview'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherTests from './pages/TeacherTests'
import TeacherStudentList from './pages/TeacherStudentList'
import TeacherCreateTest from './pages/TeacherCreateTest'
import TeacherAddQuestions from './pages/TeacherAddQuestions'
import TeacherSubmissions from './pages/TeacherSubmissions'
import TeacherAnalytics from './pages/TeacherAnalytics'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          {/* Test attempt pages — no layout sidebar */}
          <Route path="/student/tests/:id/instructions" element={<TestInstructions />} />
          <Route path="/student/tests/:id/attempt" element={<TestAttempt />} />
          <Route path="/student/tests/:id/result" element={<TestResult />} />
          <Route path="/student/tests/:id/review" element={<TestReview />} />
          {/* Main layout */}
          <Route element={<Layout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/tests" element={<StudentTests />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/tests" element={<TeacherTests />} />
            <Route path="/teacher/students" element={<TeacherStudentList />} />
            <Route path="/teacher/create" element={<TeacherCreateTest />} />
            <Route path="/teacher/tests/:id/add-questions" element={<TeacherAddQuestions />} />
            <Route path="/teacher/tests/:id/questions" element={<TeacherAddQuestions />} />
            <Route path="/teacher/tests/:id/submissions" element={<TeacherSubmissions />} />
            <Route path="/teacher/tests/:id/analytics" element={<TeacherAnalytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}