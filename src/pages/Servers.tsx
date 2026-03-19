import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { useServers } from '@/hooks/useServers'
import styles from './Servers.module.css'

const MOCK_USERNAME = 'Steve'

export default function Servers() {
  const { servers, loading } = useServers()

  const list = servers.length > 0 ? servers : MOCK_SERVERS

  return (
    <div className={styles.layout}>
      <Navbar username={MOCK_USERNAME} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <h1 className={styles.title}>Serveurs</h1>
          <p className={styles.subtitle}>{list.filter(s => s.online).length} serveurs en ligne</p>

          {loading ? (
            <p className={styles.loading}>Chargement…</p>
          ) : (
            <div className={styles.grid}>
              {list.map((s) => {
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
          )}
        </main>
      </div>
    </div>
  )
}

import type { Server } from '@/hooks/useServers'

const MOCK_SERVERS: Server[] = [
  { id: 1,  name: 'Paris-01',      region: 'Île-de-France',        players: 143, maxPlayers: 200, online: true },
  { id: 2,  name: 'Lyon-02',       region: 'Auvergne-Rhône-Alpes', players: 90,  maxPlayers: 200, online: true },
  { id: 3,  name: 'Marseille-03',  region: 'PACA',                 players: 182, maxPlayers: 200, online: true },
  { id: 4,  name: 'Bordeaux-04',   region: 'Nouvelle-Aquitaine',   players: 60,  maxPlayers: 200, online: true },
  { id: 5,  name: 'Lille-05',      region: 'Hauts-de-France',      players: 110, maxPlayers: 200, online: true },
  { id: 6,  name: 'Nantes-06',     region: 'Pays de la Loire',     players: 40,  maxPlayers: 200, online: true },
  { id: 7,  name: 'Strasbourg-07', region: 'Grand Est',            players: 75,  maxPlayers: 200, online: true },
  { id: 8,  name: 'Toulouse-08',   region: 'Occitanie',            players: 130, maxPlayers: 200, online: true },
  { id: 9,  name: 'Rennes-09',     region: 'Bretagne',             players: 55,  maxPlayers: 200, online: true },
  { id: 10, name: 'Nice-10',       region: 'Côte d\'Azur',         players: 98,  maxPlayers: 200, online: true },
  { id: 11, name: 'Grenoble-11',   region: 'Auvergne-Rhône-Alpes', players: 44,  maxPlayers: 200, online: true },
  { id: 12, name: 'Montpellier-12',region: 'Occitanie',            players: 160, maxPlayers: 200, online: true },
]
