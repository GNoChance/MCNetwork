import { PlayerAvatar } from '@/components/skin/PlayerAvatar'
import styles from './Navbar.module.css'

interface NavbarProps {
  username: string
}

export function Navbar({ username }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.logoDot} />
        MCNetwork
      </div>
      <div className={styles.right}>
        <PlayerAvatar username={username} size={28} />
        <span className={styles.username}>{username}</span>
      </div>
    </nav>
  )
}
