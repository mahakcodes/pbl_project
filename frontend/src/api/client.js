const API_BASE = "https://digital-test-and-evaluation-portal.onrender.com/api";

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Network error",
      }));
      throw error;
    }

    return response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export const api = {
  auth: {
    login: (data) =>
      request("/auth/login/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  student: {
    dashboard: (uid) =>
      request(`/tests/student/dashboard/?user_id=${uid}`),

    tests: (uid) =>
      request(`/tests/student/tests/?user_id=${uid}`),

    testDetail: (tid) =>
      request(`/tests/student/tests/${tid}/`),

    questions: (tid, uid) =>
      request(`/tests/student/tests/${tid}/questions/?user_id=${uid}`),

    startTest: (tid, uid) =>
      request(`/tests/student/tests/${tid}/start/`, {
        method: "POST",
        body: JSON.stringify({ user_id: uid }),
      }),

    saveAnswer: (tid, uid, question_id, selected_option) =>
      request(`/tests/student/tests/${tid}/save-answer/`, {
        method: "POST",
        body: JSON.stringify({ user_id: uid, question_id, selected_option }),
      }),

    submitTest: (tid, uid, auto = false) =>
      request(`/tests/student/tests/${tid}/submit/`, {
        method: "POST",
        body: JSON.stringify({ user_id: uid, auto_submitted: auto }),
      }),

    result: (tid, uid) =>
      request(`/tests/student/tests/${tid}/result/?user_id=${uid}`),

    review: (tid, uid) =>
      request(`/tests/student/tests/${tid}/review/?user_id=${uid}`),
  },

  teacher: {
    dashboard: (uid) =>
      request(`/tests/teacher/dashboard/?user_id=${uid}`),

    tests: (uid) =>
      request(`/tests/teacher/tests/?user_id=${uid}`),

    createTest: (data) =>
      request(`/tests/teacher/tests/create/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    editTest: (tid, data) =>
      request(`/tests/teacher/tests/${tid}/edit/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteTest: (tid) =>
      request(`/tests/teacher/tests/${tid}/delete/`, {
        method: "DELETE",
      }),

    addQuestion: (tid, data) =>
      request(`/tests/teacher/tests/${tid}/add-question/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    questions: (tid) =>
      request(`/tests/teacher/tests/${tid}/questions/`),

    editQuestion: (qid, data) =>
      request(`/tests/teacher/questions/${qid}/edit/`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteQuestion: (qid) =>
      request(`/tests/teacher/questions/${qid}/edit/`, {
        method: "DELETE",
      }),

    publishTest: (tid) =>
      request(`/tests/teacher/tests/${tid}/publish/`, {
        method: "POST",
      }),

    submissions: (tid) =>
      request(`/tests/teacher/tests/${tid}/submissions/`),

    analytics: (tid) =>
      request(`/tests/teacher/tests/${tid}/analytics/`),
  },
};