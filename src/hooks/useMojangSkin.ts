import { useState, useEffect } from 'react'

interface MojangProfile {
  uuid: string
  skinUrl: string | null
}

export function useMojangSkin(username: string): MojangProfile & { loading: boolean } {
  const [data, setData] = useState<MojangProfile>({ uuid: '', skinUrl: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!username) return

    const fetchSkin = async () => {
      try {
        // 1. Récupère l'UUID depuis le pseudo
        const profileRes = await fetch(
          `https://api.mojang.com/users/profiles/minecraft/${username}`
        )
        if (!profileRes.ok) throw new Error('Joueur introuvable')
        const profile = await profileRes.json()

        // 2. Récupère les textures depuis l'UUID
        const sessionRes = await fetch(
          `https://sessionserver.mojang.com/session/minecraft/profile/${profile.id}`
        )
        const session = await sessionRes.json()

        const texturesProperty = session.properties?.find(
          (p: { name: string }) => p.name === 'textures'
        )

        if (texturesProperty) {
          const decoded = JSON.parse(atob(texturesProperty.value))
          const skinUrl = decoded.textures?.SKIN?.url ?? null
          setData({ uuid: profile.id, skinUrl })
        }
      } catch (err) {
        console.error('Erreur Mojang API:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSkin()
  }, [username])

  return { ...data, loading }
}
