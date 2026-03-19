interface PlayerAvatarProps {
  username: string
  size?: number
}

// Utilise l'API Crafatar pour afficher la tête du skin en 2D
export function PlayerAvatar({ username, size = 32 }: PlayerAvatarProps) {
  return (
    <img
      src={`https://crafatar.com/avatars/${username}?size=${size}&overlay`}
      alt={username}
      width={size}
      height={size}
      style={{
        borderRadius: '4px',
        imageRendering: 'pixelated',
        display: 'block',
      }}
      onError={(e) => {
        // Fallback si l'API est indisponible
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
      }}
    />
  )
}
