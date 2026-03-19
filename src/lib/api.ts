import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// --- Auth ---
export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password })

// --- Servers ---
export const getServers = () => api.get('/servers')

// --- History ---
export const getHistory = () => api.get('/history')

// --- Player ---
export const getPlayer = () => api.get('/player/me')
