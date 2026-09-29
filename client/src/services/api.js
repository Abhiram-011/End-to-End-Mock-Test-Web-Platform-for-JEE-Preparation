const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('jee_prep_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

// Authentication
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  getMe: () => request('/auth/me'),

  getDemoAccounts: () => request('/auth/demo-accounts')
};

// Tests
export const testsAPI = {
  getAll: (category) =>
    request(`/tests${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),

  getById: (id) => request(`/tests/${id}`),

  getExamSession: (id) => request(`/tests/${id}/take`),

  createTest: (testData) =>
    request('/tests', {
      method: 'POST',
      body: JSON.stringify(testData)
    }),

  updateTest: (id, testData) =>
    request(`/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData)
    }),

  deleteTest: (id) =>
    request(`/tests/${id}`, {
      method: 'DELETE'
    })
};

// Submissions & Grading
export const submissionsAPI = {
  submitExam: (testId, payload) =>
    request(`/submissions/${testId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMyHistory: () => request('/submissions/my'),

  getResultById: (id) => request(`/submissions/${id}`)
};

// Analytics
export const analyticsAPI = {
  getTeacherDashboard: () => request('/analytics/dashboard'),

  getLeaderboard: (testId) => request(`/analytics/leaderboard/${testId}`)
};
