import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/servers',   label: 'Serveurs' },
  { to: '/history',   label: 'Historique' },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  )
}
