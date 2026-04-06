import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlayerSkin3D } from '@/components/skin/PlayerSkin3D'
import { Spotlight } from '@/components/ui/Spotlight'
import styles from './Home.module.css'

const STEVE_SKIN = '/skins/SkinSteve.png'

export default function Home() {
  const navigate = useNavigate()
  const [skinUrl, setSkinUrl] = useState(STEVE_SKIN)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const uuid = localStorage.getItem('uuid')
    const storedUsername = localStorage.getItem('username')

    if (token && uuid && storedUsername) {
      setUsername(storedUsername)
      setSkinUrl(`https://crafatar.com/skins/${uuid}?overlay`)
    }
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.grid} />

      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <span className={styles.logoDot} />
          MCNetwork
        </div>

        {username ? (
          <div className={styles.navRight}>
            <span className={styles.navUser}>{username}</span>
            <button className={styles.navBtn} onClick={() => navigate('/dashboard')}>
              Dashboard →
            </button>
          </div>
        ) : (
          <button className={styles.navBtn} onClick={() => navigate('/login')}>
            Se connecter
          </button>
        )}
      </nav>

      {/* ── Hero ── */}
      <main className={styles.hero}>

        {/* Left — texte */}
        <div className={styles.heroText}>
          <div className={styles.tag}>
            <span className={styles.tagDot} />
            Gestionnaire de serveurs
          </div>

          <h1 className={styles.title}>
            Ton réseau<br />
            <span className={styles.accent}>Minecraft</span><br />
            en un coup d'œil
          </h1>

          <p className={styles.subtitle}>
            Connecte-toi avec ton compte Microsoft pour accéder à tous tes serveurs,
            consulter ton historique de connexions et gérer ton profil joueur.
          </p>

          <div className={styles.actions}>
            {username ? (
              <button
                className={styles.btnPrimary}
                onClick={() => navigate('/dashboard')}
              >
                Accéder au dashboard →
              </button>
            ) : (
              <>
                <button
                  className={styles.btnPrimary}
                  onClick={() => navigate('/login')}
                >
                  Commencer →
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={() => navigate('/servers')}
                >
                  Voir les serveurs
                </button>
              </>
            )}
          </div>

          {/* Feature list */}
          <ul className={styles.features}>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>▸</span>
              Skin 3D interactif en temps réel
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>▸</span>
              Historique de connexions détaillé
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>▸</span>
              Monitoring des serveurs 24/7
            </li>
          </ul>
        </div>

        {/* Right — skin card */}
        <div className={styles.heroSkin}>
          <div className={styles.skinCard}>
            {/* Spotlight effect */}
            <Spotlight fill="white" />

            <div className={styles.skinInner}>
              <div className={styles.skinLabel}>
                {username ? (
                  <>
                    <span className={styles.skinLabelDot} />
                    {username}
                  </>
                ) : (
                  <>
                    <span className={styles.skinLabelDot} />
                    Steve (défaut)
                  </>
                )}
              </div>

              <PlayerSkin3D
                skinUrl={skinUrl}
                width={260}
                height={440}
                animation="idle"
                mouseTrack={true}
              />

              <div className={styles.skinGlow} />
            </div>
          </div>

          {/* Decorative blobs */}
          <div className={styles.blobTopRight} />
          <div className={styles.blobBottomLeft} />
        </div>
      </main>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>12</span>
          <span className={styles.statLabel}>Serveurs actifs</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>200</span>
          <span className={styles.statLabel}>Joueurs max / serveur</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>24/7</span>
          <span className={styles.statLabel}>Disponibilité</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>99.9%</span>
          <span className={styles.statLabel}>Uptime</span>
        </div>
      </section>
    </div>
  )
}
