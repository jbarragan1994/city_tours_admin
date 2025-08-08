export function getAuthUrl() {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'

  const backendURL = import.meta.env.VITE_BACKEND_URL
  const redirectUri = isLocalhost ? 'http://localhost:3000/auth' : backendURL + '/auth'

  const baseUrl = 'https://auth.tourist.land/login'
  const params = new URLSearchParams({
    client_id: '45rjcsjmkcv2624ev0219g1f2q',
    response_type: 'code',
    scope: 'email openid phone',
    redirect_uri: redirectUri,
  })

  return `${baseUrl}?${params.toString()}`
}
