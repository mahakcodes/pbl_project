const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const request = async (endpoint, options = {}) => {
  console.log('🌐 API Request:', `${API_BASE}${endpoint}`)  // DEBUG
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  console.log('📥 API Response status:', response.status)  // DEBUG
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw error
  }
  
  return response.json()
}

export const api = {
  auth: {
    login: (data) => {
      console.log('🔐 Attempting login with:', data)  // DEBUG
      return request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
  student: {
    dashboard: () => request('/tests/student/dashboard/'),
    tests: () => request('/tests/student/tests/'),
  },
  teacher: {
    dashboard: () => request('/tests/teacher/dashboard/'),
    tests: () => request('/tests/teacher/tests/'),
  },
}