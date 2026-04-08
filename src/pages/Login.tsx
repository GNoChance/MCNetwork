import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { login } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import styles from './Login.module.css'

const BACKEND_URL = 'http://localhost:8080'

const FEATURES = [
  { text: 'Skin 3D interactif en temps réel' },
  { text: 'Historique de connexions détaillé' },
  { text: 'Monitoring des serveurs 24/7' },
  { text: 'Gestion de profil joueur' },
]

export default function Login() {
  const navigate        = useNavigate()
  const [searchParams]  = useSearchParams()
  const { login: authLogin } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  /* Handle OAuth redirect error */
  useEffect(() => {
    const err = searchParams.get('error')
    if (err) setError('Erreur de connexion Microsoft : ' + err)
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    setError('')
    setLoading(true)
    try {
      const res = await login(username, password)
      localStorage.setItem('token',    res.data.token)
      localStorage.setItem('username', username)
      if (res.data.uuid) localStorage.setItem('uuid', res.data.uuid)
      authLogin({ username, role: res.data.role ?? 'user', uuid: res.data.uuid })
      navigate('/dashboard')
    } catch {
      setError('Pseudo ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoft = () => {
    window.location.href = `${BACKEND_URL}/api/auth/microsoft`
  }

  return (
    <div className={styles.page}>

      {/* ══════════════════════════════════════
          LEFT — Branding panel
      ══════════════════════════════════════ */}
      <aside className={styles.visual} aria-hidden="true">
        <div className={styles.visualGrid} />
        <div className={styles.visualGlow} />

        <div className={styles.visualContent}>
          {/* Logo */}
          <Link to="/" className={styles.visualLogo}>
            <span className={styles.logoDot} />
            MCNetwork
          </Link>

          {/* Hero text */}
          <div className={styles.visualHero}>
            <h2 className={styles.visualTitle}>
              Gère ton réseau<br />
              <span className={styles.visualAccent}>Minecraft</span><br />
              en un coup d'œil
            </h2>
            <p className={styles.visualSubtitle}>
              Connecte-toi pour accéder à tous tes serveurs
              et gérer ton profil joueur depuis une seule interface.
            </p>
          </div>

          {/* Feature list */}
          <ul className={styles.featureList} role="list">
            {FEATURES.map(({ text }) => (
              <li key={text} className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">▸</span>
                {text}
              </li>
            ))}
          </ul>

          {/* Status badges */}
          <div className={styles.visualFooter}>
            <span className={styles.statBadge}>Serveurs actifs</span>
            <span className={styles.statBadge}>99.9% uptime</span>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          RIGHT — Form
      ══════════════════════════════════════ */}
      <main className={styles.formSide}>
        <div className={styles.card}>

          {/* Mobile logo */}
          <Link to="/" className={styles.mobileLogo}>
            <span className={styles.logoDot} />
            MCNetwork
          </Link>

          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.subtitle}>
            Entre ton pseudo Minecraft et ton mot de passe.
          </p>

          {/* ── Classic form ── */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Pseudo Minecraft
              </label>
              <input
                id="username"
                className={styles.input}
                type="text"
                placeholder="Steve"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                aria-required="true"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                aria-required="true"
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">{error}</p>
            )}

            <button
              className={styles.btnPrimary}
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Connexion…
                </>
              ) : (
                'Se connecter →'
              )}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className={styles.divider}>
            <span>ou continuer avec</span>
          </div>

          {/* ── Microsoft OAuth ── */}
          <button
            className={styles.btnMicrosoft}
            onClick={handleMicrosoft}
            type="button"
          >
            {/* Microsoft logo */}
            <svg width="17" height="17" viewBox="0 0 21 21" fill="none" aria-hidden="true">
              <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
              <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Continuer avec Microsoft
          </button>

          {/* ── Back to home ── */}
          <p className={styles.backLink}>
            <Link to="/" className={styles.link}>← Retour à l'accueil</Link>
          </p>

          {/* ── Register CTA ── */}
          <p className={styles.registerLine}>
            Pas encore de compte ?{' '}
            <Link to="/signup" className={styles.registerLink}>
              Créer un compte
            </Link>
          </p>
        </div>
      </main>

    </div>
  )
}
