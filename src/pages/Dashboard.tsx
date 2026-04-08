import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { useAuth } from '@/context/AuthContext'
import { PlayerSkin3D } from '@/components/skin/PlayerSkin3D'
import { useServers } from '@/hooks/useServers'
import {
  Cpu, MemoryStick, Server, Users, Activity,
  Shield, LogIn, Ban, AlertTriangle, ChevronRight
} from 'lucide-react'
import type { Server as ServerType } from '@/hooks/useServers'

type AnimType = 'walk' | 'run' | 'idle'

// ── Simulated live metrics ──────────────────────────────────────────
function useLiveMetrics() {
  const [cpu, setCpu] = useState(42)
  const [ram, setRam] = useState(61)

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((v) => Math.min(95, Math.max(5, v + (Math.random() * 10 - 5))))
      setRam((v) => Math.min(92, Math.max(30, v + (Math.random() * 6 - 3))))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return { cpu: Math.round(cpu), ram: Math.round(ram) }
}

// ── Admin logs (fake) ───────────────────────────────────────────────
const FAKE_LOGS = [
  { time: '09:14:32', level: 'INFO',  msg: '[Auth] Microsoft login: Notch' },
  { time: '09:11:05', level: 'WARN',  msg: '[AntiCheat] Suspicious movement detected: xX_Pro_Xx' },
  { time: '09:08:47', level: 'INFO',  msg: '[Server] World saved — 12 chunks flushed' },
  { time: '09:05:12', level: 'ERROR', msg: '[DB] Connection timeout — retrying (1/3)' },
  { time: '09:03:00', level: 'INFO',  msg: '[Auth] Admin login: Link (admin)' },
  { time: '08:58:21', level: 'INFO',  msg: '[Server] SkyWars restarted by Link' },
]

const FAKE_USERS = [
  { username: 'Notch', role: 'user',  status: 'online' },
  { username: 'Herobrine', role: 'user', status: 'banned' },
  { username: 'xX_Pro_Xx', role: 'user', status: 'online' },
  { username: 'Steve_42', role: 'user', status: 'offline' },
]

// ── Components ──────────────────────────────────────────────────────
function MetricBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function ServerCard({ server }: { server: ServerType }) {
  const pct = Math.round((server.players / server.maxPlayers) * 100)
  const isBusy = pct >= 80
  return (
    <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{server.name}</span>
        <span className={`w-2 h-2 rounded-full ${isBusy ? 'bg-orange-400' : 'bg-green-400'} shadow-[0_0_6px_currentColor]`} />
      </div>
      <p className="text-xs text-white/35">{server.region}</p>
      <MetricBar value={pct} color={isBusy ? 'bg-orange-400' : 'bg-green-400'} />
      <p className="text-xs text-white/40">{server.players} / {server.maxPlayers} joueurs</p>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { servers, loading } = useServers()
  const [anim, setAnim] = useState<AnimType>('walk')
  const { cpu, ram } = useLiveMetrics()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  if (!user) return null

  const isAdmin = user.role === 'admin'
  const skinUrl = user.uuid
    ? `https://crafatar.com/skins/${user.uuid}?overlay`
    : '/skins/SkinSteve.png'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col gap-8">

        {/* ── Profile hero ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <PlayerSkin3D skinUrl={skinUrl} width={80} height={120} animation={anim} />
            <div className="flex gap-1">
              {(['walk', 'run', 'idle'] as AnimType[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAnim(a)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    anim === a
                      ? 'bg-green-400/15 text-green-400 border border-green-400/30'
                      : 'text-white/30 hover:text-white/60 border border-transparent'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-mono font-bold text-white">{user.username}</h1>
              {isAdmin && (
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold tracking-widest uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg">
                  <Shield size={11} strokeWidth={2.5} />
                  Administrateur
                </span>
              )}
              <span className="flex items-center gap-1.5 px-2 py-1 text-xs bg-green-400/10 text-green-400 border border-green-400/20 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                En ligne
              </span>
            </div>
            <p className="text-sm text-white/40">
              {isAdmin
                ? 'Accès complet — gestion des serveurs, logs système et utilisateurs.'
                : 'Joueur enregistré sur MCNetwork.'}
            </p>
          </div>
        </section>

        {/* ── CPU / RAM metrics ── */}
        <section>
          <h2 className="text-xs font-mono font-bold text-white/30 uppercase tracking-widest mb-4">Métriques système</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU */}
            <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Cpu size={14} className="text-blue-400" />
                  CPU
                </div>
                <span className="text-lg font-mono font-bold text-blue-400">{cpu}%</span>
              </div>
              <MetricBar value={cpu} color={cpu > 80 ? 'bg-red-400' : cpu > 60 ? 'bg-orange-400' : 'bg-blue-400'} />
            </div>

            {/* RAM */}
            <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <MemoryStick size={14} className="text-purple-400" />
                  RAM
                </div>
                <span className="text-lg font-mono font-bold text-purple-400">{ram}%</span>
              </div>
              <MetricBar value={ram} color={ram > 85 ? 'bg-red-400' : ram > 70 ? 'bg-orange-400' : 'bg-purple-400'} />
            </div>

            {/* Servers online */}
            <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Server size={14} className="text-green-400" />
                  Serveurs
                </div>
                <span className="text-lg font-mono font-bold text-green-400">
                  {loading ? '…' : servers.length}
                </span>
              </div>
              <MetricBar value={servers.length * 10} color="bg-green-400" />
            </div>

            {/* Players */}
            <div className="p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Activity size={14} className="text-amber-400" />
                  Joueurs en ligne
                </div>
                <span className="text-lg font-mono font-bold text-amber-400">
                  {loading ? '…' : servers.reduce((a, s) => a + s.players, 0)}
                </span>
              </div>
              <MetricBar value={65} color="bg-amber-400" />
            </div>
          </div>
        </section>

        {/* ── Server management ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-bold text-white/30 uppercase tracking-widest">Serveurs disponibles</h2>
            {isAdmin && (
              <button className="flex items-center gap-1.5 text-xs text-green-400/70 hover:text-green-400 transition-colors">
                Gérer <ChevronRight size={12} />
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-white/30 p-4">
              <span className="w-4 h-4 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
              Chargement…
            </div>
          ) : servers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map((s) => <ServerCard key={s.id} server={s} />)}
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center">
              <Server size={24} className="text-white/15 mx-auto mb-2" />
              <p className="text-sm text-white/30">Aucun serveur disponible pour l'instant.</p>
            </div>
          )}
        </section>

        {/* ── Admin-only sections ── */}
        {isAdmin && (
          <>
            {/* System logs */}
            <section>
              <h2 className="text-xs font-mono font-bold text-white/30 uppercase tracking-widest mb-4">Logs système</h2>
              <div className="rounded-2xl border border-white/[0.07] bg-black/40 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-white/20 font-mono">mcnetwork — logs</span>
                </div>
                <div className="p-4 flex flex-col gap-1 font-mono text-xs">
                  {FAKE_LOGS.map(({ time, level, msg }, i) => (
                    <div key={i} className="flex items-baseline gap-3">
                      <span className="text-white/20 shrink-0">{time}</span>
                      <span className={`shrink-0 w-12 text-center px-1 rounded text-[10px] font-bold ${
                        level === 'ERROR' ? 'bg-red-500/15 text-red-400' :
                        level === 'WARN'  ? 'bg-amber-500/15 text-amber-400' :
                                            'bg-green-500/10 text-green-400'
                      }`}>{level}</span>
                      <span className="text-white/60">{msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* User management */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono font-bold text-white/30 uppercase tracking-widest">Gestion des joueurs</h2>
                <span className="flex items-center gap-1 text-xs text-white/25">
                  <Users size={11} /> {FAKE_USERS.length} utilisateurs
                </span>
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="divide-y divide-white/[0.05]">
                  {FAKE_USERS.map(({ username, role, status }) => (
                    <div key={username} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white/60">
                          {username.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white">{username}</p>
                          <p className="text-xs text-white/30 capitalize">{role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1.5 text-xs ${
                          status === 'online' ? 'text-green-400' :
                          status === 'banned' ? 'text-red-400' : 'text-white/30'
                        }`}>
                          {status === 'online' && <><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />En ligne</>}
                          {status === 'banned' && <><Ban size={11} />Banni</>}
                          {status === 'offline' && <>Hors ligne</>}
                        </span>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/25 hover:text-red-400 transition-colors" title="Ban">
                          <AlertTriangle size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/25 hover:text-green-400 transition-colors" title="Logs">
                          <LogIn size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
