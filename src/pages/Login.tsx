import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { login } from '@/lib/api'
import styles from './Login.module.css'

const BACKEND_URL = 'http://localhost:8080'

const FEATURES = [
  { icon: '▸', text: 'Skin 3D interactif en temps réel' },
  { icon: '▸', text: 'Historique de connexions détaillé' },
  { icon: '▸', text: 'Monitoring des serveurs 24/7' },
  { icon: '▸', text: 'Gestion de profil joueur' },
]

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      {/* ── Panneau gauche — visuel ── */}
      <aside className={styles.visual} aria-hidden="true">
        <div className={styles.visualGrid} />
        <div className={styles.visualGlow} />

        <div className={styles.visualContent}>
          <Link to="/" className={styles.visualLogo}>
            <span className={styles.logoDot} />
            MCNetwork
          </Link>

          <div className={styles.visualHero}>
            <h2 className={styles.visualTitle}>
              Ton réseau<br />
              <span className={styles.visualAccent}>Minecraft</span><br />
              en un coup d'œil
            </h2>
            <p className={styles.visualSubtitle}>
              Connecte-toi pour accéder à tous tes serveurs et gérer ton profil joueur.
            </p>
          </div>

          <ul className={styles.featureList} role="list">
            {FEATURES.map(({ icon, text }) => (
              <li key={text} className={styles.featureItem}>
                <span className={styles.featureIcon}>{icon}</span>
                {text}
              </li>
            ))}
          </ul>

          <div className={styles.visualFooter}>
            <span className={styles.statBadge}>12 serveurs actifs</span>
            <span className={styles.statBadge}>99.9% uptime</span>
          </div>
        </div>
      </aside>

      {/* ── Panneau droit — formulaire ── */}
      <main className={styles.formSide}>
        <div className={styles.card}>
          {/* Logo mobile (caché sur desktop) */}
          <Link to="/" className={styles.mobileLogo}>
            <span className={styles.logoDot} />
            MCNetwork
          </Link>

          <h1 className={styles.title}>Connexion</h1>
          <p className={styles.subtitle}>Entre ton pseudo Minecraft et ton mot de passe</p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">Pseudo Minecraft</label>
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
              <label className={styles.label} htmlFor="password">Mot de passe</label>
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

            <button className={styles.btnPrimary} type="submit" disabled={loading} aria-busy={loading}>
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

          <div className={styles.divider}>
            <span>ou continuer avec</span>
          </div>

          <button className={styles.btnMicrosoft} onClick={handleMicrosoftLogin} type="button">
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Microsoft
          </button>

          <p className={styles.backLink}>
            <Link to="/" className={styles.link}>← Retour à l'accueil</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
