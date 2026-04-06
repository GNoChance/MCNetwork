import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { PlayerSkin3D } from '@/components/skin/PlayerSkin3D'
import { useServers } from '@/hooks/useServers'
import { formatDate, formatDuration } from '@/lib/utils'
import styles from './Dashboard.module.css'
import type { Server } from '@/hooks/useServers'

const storedUsername = localStorage.getItem('username') ?? 'Joueur'
const storedUuid     = localStorage.getItem('uuid') ?? ''
const skinUrl        = storedUuid
  ? `https://crafatar.com/skins/${storedUuid}?overlay`
  : '/skins/SkinSteve.png'

type AnimType = 'walk' | 'run' | 'idle'

export default function Dashboard() {
  const { servers, loading } = useServers()
  const [anim, setAnim] = useState<AnimType>('walk')

  return (
    <div className={styles.layout}>
      <Navbar username={storedUsername} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>

          {/* Hero — skin 3D + infos joueur */}
          <section className={styles.hero}>
            <div className={styles.skinWrapper}>
              <PlayerSkin3D skinUrl={skinUrl} width={130} height={220} animation={anim} />
              <div className={styles.animControls}>
                {(['walk', 'run', 'idle'] as AnimType[]).map((a) => (
                  <button
                    key={a}
                    className={`${styles.animBtn} ${anim === a ? styles.animBtnActive : ''}`}
                    onClick={() => setAnim(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.heroInfo}>
              <p className={styles.heroWelcome}>Bon retour,</p>
              <h1 className={styles.heroName}>{storedUsername}</h1>
              <div className={styles.heroBadge}>
                <span className={styles.heroDot} />
                Connecté
              </div>
              <p className={styles.heroHint}>Glisse le skin pour le faire tourner</p>
            </div>
          </section>

          {/* Serveurs */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Serveurs disponibles</h2>
            {loading ? (
              <p className={styles.loading}>Chargement…</p>
            ) : servers.length > 0 ? (
              <div className={styles.serversGrid}>
                {servers.map((s) => (
                  <ServerCard key={s.id} server={s} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>Aucun serveur disponible — connecte ton infrastructure pour commencer.</p>
              </div>
            )}
          </section>

          {/* Historique */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Historique de connexions</h2>
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Aucune connexion enregistrée pour l'instant.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}

function ServerCard({ server }: { server: Server }) {
  const pct = Math.round((server.players / server.maxPlayers) * 100)
  const isBusy = pct >= 80

  return (
    <div className={styles.serverCard}>
      <div className={styles.serverTop}>
        <span className={styles.serverName}>{server.name}</span>
        <span className={`${styles.serverDot} ${isBusy ? styles.busy : styles.online}`} />
      </div>
      <p className={styles.serverRegion}>{server.region}</p>
      <div className={styles.barBg}>
        <div
          className={`${styles.bar} ${isBusy ? styles.barBusy : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={styles.serverPlayers}>{server.players} / {server.maxPlayers} joueurs</p>
    </div>
  )
}

// Re-export pour éviter l'erreur d'import inutilisé
export { formatDate, formatDuration }
