const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const request = async (endpoint, options={}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, { headers: {'Content-Type':'application/json', ...options.headers}, ...options })
  if (!res.ok) throw await res.json().catch(() => ({message:'Network error'}))
  return res.json()
}
export const api = { auth: { login: d => request('/auth/login/', { method:'POST', body:JSON.stringify(d) }) }, student: { dashboard: () => request('/tests/student/dashboard/'), tests: () => request('/tests/student/tests/') }, teacher: { dashboard: () => request('/tests/teacher/dashboard/'), tests: () => request('/tests/teacher/tests/') } }