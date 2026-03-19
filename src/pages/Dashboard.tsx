import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { PlayerSkin3D } from '@/components/skin/PlayerSkin3D'
import { useServers } from '@/hooks/useServers'
import { formatDate, formatDuration } from '@/lib/utils'
import styles from './Dashboard.module.css'

// Données mockées pour l'instant — à remplacer par l'API Spring Boot
const MOCK_USERNAME = 'Steve'
const MOCK_SKIN_URL = '/skins/link-botw-sequel.png'

const MOCK_HISTORY = [
  { id: 1, server: 'Paris-01',    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),        duration: 134 },
  { id: 2, server: 'Lyon-02',     date: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),   duration: 45  },
  { id: 3, server: 'Marseille-03',date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),   duration: 90  },
  { id: 4, server: 'Paris-01',    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),   duration: 182 },
]

type AnimType = 'walk' | 'run' | 'idle'

export default function Dashboard() {
  const { servers, loading } = useServers()
  const [anim, setAnim] = useState<AnimType>('walk')

  return (
    <div className={styles.layout}>
      <Navbar username={MOCK_USERNAME} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>

          {/* Hero — skin 3D + infos joueur */}
          <section className={styles.hero}>
            <div className={styles.skinWrapper}>
              <PlayerSkin3D skinUrl={MOCK_SKIN_URL} width={130} height={220} animation={anim} />
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
              <h1 className={styles.heroName}>{MOCK_USERNAME}</h1>
              <div className={styles.heroBadge}>
                <span className={styles.heroDot} />
                Connecté · Paris-01
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
              /* Fallback mock quand l'API n'est pas encore branchée */
              <div className={styles.serversGrid}>
                {MOCK_SERVERS.map((s) => (
                  <ServerCard key={s.id} server={s} />
                ))}
              </div>
            )}
          </section>

          {/* Historique */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Historique de connexions</h2>
            <div className={styles.historyList}>
              {MOCK_HISTORY.map((h) => (
                <div key={h.id} className={styles.historyRow}>
                  <span className={styles.historyDot} />
                  <span className={styles.historyServer}>{h.server}</span>
                  <span className={styles.historyDate}>{formatDate(h.date)}</span>
                  <span className={styles.historyDuration}>{formatDuration(h.duration)}</span>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}

// --- Sous-composant ServerCard ---
import type { Server } from '@/hooks/useServers'

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

const MOCK_SERVERS: Server[] = [
  { id: 1, name: 'Paris-01',     region: 'Île-de-France',       players: 143, maxPlayers: 200, online: true },
  { id: 2, name: 'Lyon-02',      region: 'Auvergne-Rhône',      players: 90,  maxPlayers: 200, online: true },
  { id: 3, name: 'Marseille-03', region: 'PACA',                players: 182, maxPlayers: 200, online: true },
  { id: 4, name: 'Bordeaux-04',  region: 'Nouvelle-Aquitaine',  players: 60,  maxPlayers: 200, online: true },
  { id: 5, name: 'Lille-05',     region: 'Hauts-de-France',     players: 110, maxPlayers: 200, online: true },
  { id: 6, name: 'Nantes-06',    region: 'Pays de la Loire',    players: 40,  maxPlayers: 200, online: true },
]
