import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login } from '@/lib/api'
import styles from './Login.module.css'

const BACKEND_URL = 'http://localhost:8080'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Affiche une erreur si Microsoft a renvoyé ?error=...
  useEffect(() => {
    const err = searchParams.get('error')
    if (err) setError('Erreur de connexion Microsoft : ' + err)
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', username)
      navigate('/dashboard')
    } catch {
      setError('Pseudo ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftLogin = () => {
    window.location.href = `${BACKEND_URL}/api/auth/microsoft`
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          MCNetwork
        </div>
        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.subtitle}>
          Connecte-toi avec ton compte Microsoft lié à Minecraft
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Pseudo Minecraft</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Steve"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Mot de passe</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <button className={styles.btnMicrosoft} onClick={handleMicrosoftLogin} type="button">
          <svg width="20" height="20" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
            <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
          </svg>
          Se connecter avec Microsoft
        </button>
      </div>
    </div>
  )
}
