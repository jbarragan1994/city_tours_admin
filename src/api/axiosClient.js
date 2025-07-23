import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://687925b663f24f1fdca111ca.mockapi.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token y manejar Content-Type dinámicamente
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Detecta si el cuerpo de la solicitud es FormData
    if (config.data instanceof FormData) {
      // No seteamos Content-Type, Axios lo manejará
      delete config.headers['Content-Type']
    } else {
      // Establece JSON por defecto si no es FormData
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor de respuesta para manejar errores 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosClient
