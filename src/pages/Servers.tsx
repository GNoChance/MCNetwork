import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { useServers } from '@/hooks/useServers'
import styles from './Servers.module.css'

const username = localStorage.getItem('username') ?? 'Joueur'

export default function Servers() {
  const { servers, loading } = useServers()

  return (
    <div className={styles.layout}>
      <Navbar username={username} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <h1 className={styles.title}>Serveurs</h1>

          {loading ? (
            <p className={styles.loading}>Chargement…</p>
          ) : servers.length > 0 ? (
            <>
              <p className={styles.subtitle}>{servers.filter(s => s.online).length} serveurs en ligne</p>
              <div className={styles.grid}>
                {servers.map((s) => {
                  const pct = Math.round((s.players / s.maxPlayers) * 100)
                  const isBusy = pct >= 80
                  return (
                    <div key={s.id} className={styles.card}>
                      <div className={styles.cardTop}>
                        <span className={styles.name}>{s.name}</span>
                        <span className={`${styles.dot} ${isBusy ? styles.busy : styles.online}`} />
                      </div>
                      <p className={styles.region}>{s.region}</p>
                      <div className={styles.barBg}>
                        <div
                          className={`${styles.bar} ${isBusy ? styles.barBusy : ''}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className={styles.cardBottom}>
                        <span className={styles.players}>{s.players} / {s.maxPlayers}</span>
                        <span className={`${styles.status} ${isBusy ? styles.statusBusy : styles.statusOnline}`}>
                          {isBusy ? 'Chargé' : 'Disponible'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>⬡</span>
              <p className={styles.emptyTitle}>Aucun serveur trouvé</p>
              <p className={styles.emptyText}>
                Connecte ton serveur à l'API pour qu'il apparaisse ici.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
