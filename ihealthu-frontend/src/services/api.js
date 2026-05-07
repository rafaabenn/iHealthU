import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
})

/*
//attach userId and token to every request
//we read the user object from sessionStorage and attach it as a custom header
//in order to know which user is making the request in the backend
api.interceptors.request.use((config) => {
  const stored = sessionStorage.getItem('user')
  if (stored) {
    const user = JSON.parse(stored)
    if (user?.id) {
      config.headers['x-user-id'] = user.id
    }
  }
  return config
})
*/

// Attach the JWT token to every request
// The token is stored in sessionStorage after login
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})


// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api