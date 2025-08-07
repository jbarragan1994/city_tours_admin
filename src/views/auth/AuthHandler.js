import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../../api/axiosClient'

function AuthHandler() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const callback = 'http://localhost:3000/api/auth'
    const backendURL = import.meta.env.VITE_BACKEND_URL

    if (code) {
      fetch(`${backendURL}/auth?code=${code}&callback=${callback}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error('Error al autenticar')
          return response.json()
        })
        .then(({ access_token }) => {
          localStorage.setItem('token', access_token)
          axiosClient.get('/user', access_token)
          navigate('/places')
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [location, navigate])

  return <div>Procesando autenticación...</div>
}

export default AuthHandler
