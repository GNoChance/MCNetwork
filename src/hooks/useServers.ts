import { useState, useEffect } from 'react'
import { getServers } from '@/lib/api'

export interface Server {
  id: number
  name: string
  region: string
  players: number
  maxPlayers: number
  online: boolean
}

export function useServers() {
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getServers()
      .then((res) => setServers(res.data))
      .catch(() => setError('Impossible de charger les serveurs'))
      .finally(() => setLoading(false))
  }, [])

  return { servers, loading, error }
}
