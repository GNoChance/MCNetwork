import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Shield, LogOut, User, ChevronDown, LayoutDashboard, Sword } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/dashboard', label: 'Dashboard', exact: false },
  { to: '/contact', label: 'Contact', exact: false },
]

/** Zelda-green sword avatar for the Admin/Link user */
function LinkAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
      <Sword size={14} className="text-white" strokeWidth={2.5} />
    </div>
  )
}

function UserAvatar({ username }: { username: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white border border-white/10">
      {username.charAt(0).toUpperCase()}
    </div>
  )
}

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] backdrop-blur-xl bg-black/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <NavLink to="/" className="flex items-center gap-2.5 font-mono font-bold text-white text-base shrink-0 hover:opacity-80 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
          MCNetwork
        </NavLink>

        {/* ── Nav links ── */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-green-400 bg-green-400/10 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2)]'
                    : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right — auth ── */}
        {user ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all"
            >
              {user.role === 'admin' ? <LinkAvatar /> : <UserAvatar username={user.username} />}
              <span className="text-sm text-white/90 hidden sm:block max-w-[100px] truncate">{user.username}</span>
              {user.role === 'admin' && (
                <span className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-md">
                  <Shield size={9} strokeWidth={2.5} />
                  Admin
                </span>
              )}
              <ChevronDown size={12} className={`text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
                  {user.role === 'admin' ? <LinkAvatar /> : <UserAvatar username={user.username} />}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                    <p className="text-xs text-white/35 capitalize">{user.role === 'admin' ? 'Administrateur' : 'Joueur'}</p>
                  </div>
                </div>

                <div className="p-1.5 flex flex-col gap-0.5">
                  <button
                    onClick={() => { navigate('/dashboard'); setOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <User size={13} />
                    Mon profil
                  </button>

                  <button
                    onClick={() => { navigate('/dashboard'); setOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <LayoutDashboard size={13} />
                    Dashboard
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => { navigate('/dashboard'); setOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/[0.06] transition-colors text-left"
                    >
                      <Shield size={13} />
                      Panneau Admin
                    </button>
                  )}

                  <div className="my-0.5 border-t border-white/[0.06]" />

                  <button
                    onClick={() => { logout(); setOpen(false); navigate('/') }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors text-left"
                  >
                    <LogOut size={13} />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 rounded-lg text-sm bg-green-500 hover:bg-green-400 text-black font-semibold transition-colors shadow-[0_0_16px_rgba(74,222,128,0.25)]"
            >
              S'inscrire
            </button>
          </div>
        )}
      </div>
    </header>
  )
}