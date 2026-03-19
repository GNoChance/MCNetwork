import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { formatDate, formatDuration } from '@/lib/utils'
import styles from './History.module.css'

const MOCK_USERNAME = 'Steve'

const MOCK_HISTORY = [
  { id: 1,  server: 'Paris-01',      date: new Date(Date.now() - 1000*60*30).toISOString(),          duration: 134 },
  { id: 2,  server: 'Lyon-02',       date: new Date(Date.now() - 1000*60*60*14).toISOString(),       duration: 45  },
  { id: 3,  server: 'Marseille-03',  date: new Date(Date.now() - 1000*60*60*48).toISOString(),       duration: 90  },
  { id: 4,  server: 'Paris-01',      date: new Date(Date.now() - 1000*60*60*72).toISOString(),       duration: 182 },
  { id: 5,  server: 'Bordeaux-04',   date: new Date(Date.now() - 1000*60*60*96).toISOString(),       duration: 60  },
  { id: 6,  server: 'Toulouse-08',   date: new Date(Date.now() - 1000*60*60*120).toISOString(),      duration: 25  },
  { id: 7,  server: 'Nantes-06',     date: new Date(Date.now() - 1000*60*60*144).toISOString(),      duration: 200 },
  { id: 8,  server: 'Lyon-02',       date: new Date(Date.now() - 1000*60*60*168).toISOString(),      duration: 75  },
]

export default function History() {
  const totalMinutes = MOCK_HISTORY.reduce((acc, h) => acc + h.duration, 0)

  return (
    <div className={styles.layout}>
      <Navbar username={MOCK_USERNAME} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Historique</h1>
              <p className={styles.subtitle}>{MOCK_HISTORY.length} sessions · {formatDuration(totalMinutes)} au total</p>
            </div>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Serveur</span>
              <span>Date</span>
              <span style={{ textAlign: 'right' }}>Durée</span>
            </div>
            {MOCK_HISTORY.map((h) => (
              <div key={h.id} className={styles.row}>
                <span className={styles.serverName}>{h.server}</span>
                <span className={styles.date}>{formatDate(h.date)}</span>
                <span className={styles.duration}>{formatDuration(h.duration)}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
