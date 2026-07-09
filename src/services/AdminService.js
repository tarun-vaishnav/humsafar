/**
 * AdminService — talks to the hidden admin API.
 *
 * Auth is cookie-based (httpOnly session set by the server on login), so every
 * request uses `credentials: 'include'`. No tokens are ever stored in JS —
 * that's what keeps XSS from stealing the session.
 */
import env from '@config/env'

const API_URL = env.api.baseUrl || 'http://localhost:3001'
const BASE = `${API_URL}/api/${env.admin.path}`

async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), env.api.timeoutMs)
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    const aborted = err?.name === 'AbortError'
    return { ok: false, status: 0, data: { message: aborted ? 'Request timed out.' : 'Connection failed.' } }
  } finally {
    clearTimeout(timeout)
  }
}

export const AdminService = {
  login: (email, password) => request('/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
  analytics: () => request('/analytics'),
  listInquiries: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
    ).toString()
    return request(`/inquiries${qs ? `?${qs}` : ''}`)
  },
  getInquiry: (id) => request(`/inquiries/${id}`),
  updateInquiry: (id, patch) => request(`/inquiries/${id}`, { method: 'PATCH', body: patch }),
  deleteInquiry: (id) => request(`/inquiries/${id}`, { method: 'DELETE' }),

  // Account
  changePassword: (currentPassword, newPassword) =>
    request('/account/password', { method: 'POST', body: { currentPassword, newPassword } }),

  // Train records (live inventory)
  listTrains: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
    ).toString()
    return request(`/trains${qs ? `?${qs}` : ''}`)
  },
  createTrain: (body) => request('/trains', { method: 'POST', body }),
  updateTrain: (id, body) => request(`/trains/${id}`, { method: 'PATCH', body }),
  deleteTrain: (id) => request(`/trains/${id}`, { method: 'DELETE' }),
}


export default AdminService
