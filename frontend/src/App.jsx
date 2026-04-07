import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import RoleSelection from './pages/RoleSelection'
import StudentLogin from './pages/StudentLogin'
import TeacherLogin from './pages/TeacherLogin'
import StudentDashboard from './pages/StudentDashboard'
import StudentTests from './pages/StudentTests'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherTests from './pages/TeacherTests'
import TeacherStudentList from './pages/TeacherStudentList'
import TeacherCreateTest from './pages/TeacherCreateTest'
export default function App() {
  return (<AppProvider><BrowserRouter><Routes><Route path="/" element={<RoleSelection />} /><Route path="/student/login" element={<StudentLogin />} /><Route path="/teacher/login" element={<TeacherLogin />} /><Route element={<Layout />}><Route path="/student/dashboard" element={<StudentDashboard />} /><Route path="/student/tests" element={<StudentTests />} /><Route path="/teacher/dashboard" element={<TeacherDashboard />} /><Route path="/teacher/tests" element={<TeacherTests />} /><Route path="/teacher/students" element={<TeacherStudentList />} /><Route path="/teacher/create" element={<TeacherCreateTest />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter></AppProvider>)
}