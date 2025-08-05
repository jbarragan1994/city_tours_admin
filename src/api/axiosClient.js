import axios from 'axios'

const axiosClient = axios.create({
  // baseURL: 'https://687925b663f24f1fdca111ca.mockapi.io/api',
  baseURL: 'https://tourist.land/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token y manejar Content-Type dinámicamente
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
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
      localStorage.removeItem('token')
      // window.location.href = '/login'
      window.location.href =
        'https://auth.tourist.land/login?client_id=45rjcsjmkcv2624ev0219g1f2q&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:3000/api/auth'
    }
    return Promise.reject(error)
  },
)

export default axiosClient
