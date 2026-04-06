import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Callback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token    = searchParams.get('token')
    const username = searchParams.get('username')
    const uuid     = searchParams.get('uuid')
    const error    = searchParams.get('error')

    if (error) {
      navigate('/login?error=' + error, { replace: true })
      return
    }

    if (token && username && uuid) {
      localStorage.setItem('token',    token)
      localStorage.setItem('username', username)
      localStorage.setItem('uuid',     uuid)
      navigate('/dashboard', { replace: true })
    } else {
      // Paramètres manquants → retour login
      navigate('/login?error=missing_params', { replace: true })
    }
  }, [searchParams, navigate])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0f1117',
      color: '#fff',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '4px solid #4ade80',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p>Connexion en cours…</p>
    </div>
  )
}
