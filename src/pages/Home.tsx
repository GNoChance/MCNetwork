import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { useAuth } from '@/context/AuthContext'
import { PlayerSkin3D } from '@/components/skin/PlayerSkin3D'
import { ArrowRight } from 'lucide-react'

const STEVE_SKIN = '/skins/SkinSteve.png'

/* ─── Design tokens ────────────────────────────────────────── */
const NEON         = '#00FF7F'
const NEON_DIM     = 'rgba(0,255,127,0.10)'
const NEON_BORDER  = 'rgba(0,255,127,0.22)'
const NEON_GLOW    = '0 0 36px rgba(0,255,127,0.50), 0 4px 24px rgba(0,255,127,0.28)'
const FONT         = "'Inter', 'DM Sans', sans-serif"

export default function Home() {
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const skinUrl = user?.uuid
    ? `https://crafatar.com/skins/${user.uuid}?overlay`
    : STEVE_SKIN

  return (
    <div className="relative h-screen overflow-hidden text-white"
      style={{ background: '#050505', fontFamily: FONT }}>

      {/* ── Fixed header ── */}
      <Header />

      {/* ── Subtle grid ── */}
      <div className="absolute inset-0 pointer-events-none select-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* ── Radial glow (right side, behind skin) ── */}
      <div className="absolute pointer-events-none" style={{
        top: '50%', right: '-8%', transform: 'translateY(-50%)',
        width: '55vw', height: '80vh',
        background: `radial-gradient(ellipse at 80% 50%, rgba(0,255,127,0.07) 0%, transparent 65%)`,
      }} />

      {/* ── Main content — fills screen below header ── */}
      <div className="absolute inset-0 pt-16 flex items-stretch">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14
                        grid lg:grid-cols-2 gap-0">

          {/* ════════════════════════════════════
              LEFT — Copy
          ════════════════════════════════════ */}
          <div className="flex flex-col justify-center gap-8 py-10 pr-0 lg:pr-12">

            {/* Badge */}
            <span className="inline-flex items-center gap-2 self-start
                             px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{ border: `1px solid ${NEON_BORDER}`, background: NEON_DIM, color: NEON }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: NEON }} />
              Gestionnaire de serveurs Minecraft
            </span>

            {/* Title */}
            <div className="flex flex-col" style={{ gap: '0.1em' }}>
              <h1 style={{
                fontFamily: FONT,
                fontSize:   'clamp(2.6rem, 5.5vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.95)',
              }}>
                Gère ton réseau
              </h1>
              <h1 style={{
                fontFamily:  FONT,
                fontSize:    'clamp(2.6rem, 5.5vw, 5rem)',
                fontWeight:  900,
                lineHeight:  1.04,
                letterSpacing: '-0.03em',
                color: NEON,
                textShadow: `0 0 50px rgba(0,255,127,0.55)`,
              }}>
                Minecraft
              </h1>
              <h1 style={{
                fontFamily:  FONT,
                fontSize:    'clamp(2.6rem, 5.5vw, 5rem)',
                fontWeight:  900,
                lineHeight:  1.04,
                letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.95)',
              }}>
                en un coup d'œil
              </h1>
            </div>

            {/* Subtitle */}
            <p style={{
              fontFamily: FONT,
              fontSize:   '1.05rem',
              lineHeight: 1.75,
              color:      'rgba(255,255,255,0.45)',
              maxWidth:   '400px',
            }}>
              Surveille tes serveurs, consulte les métriques en direct
              et gère tes joueurs depuis une seule interface.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3">

              {/* Primary — glow green */}
              <button
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl
                           text-sm font-bold transition-all duration-200
                           hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  fontFamily:  FONT,
                  background:  NEON,
                  color:       '#050505',
                  boxShadow:   NEON_GLOW,
                }}
              >
                {user ? 'Accéder au dashboard' : 'Créer un compte'}
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>

              {/* Secondary — ghost */}
              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-3.5 rounded-xl text-sm font-medium
                             transition-all duration-200 hover:bg-white/5"
                  style={{
                    fontFamily: FONT,
                    border:     '1px solid rgba(255,255,255,0.11)',
                    color:      'rgba(255,255,255,0.58)',
                  }}
                >
                  Se connecter
                </button>
              )}
            </div>

            {/* Tiny credibility line */}
            <div className="flex items-center gap-2" style={{ marginTop: '-4px' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: NEON }} />
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', fontFamily: FONT }}>
                Connexion via compte Microsoft Minecraft
              </span>
            </div>
          </div>

          {/* ════════════════════════════════════
              RIGHT — 3D Skin (flush bottom)
          ════════════════════════════════════ */}
          <div className="hidden lg:flex flex-col items-center justify-end relative pb-0">

            {/* Floating username chip */}
            <div
              className="absolute flex items-center gap-2 px-2.5 py-1 rounded-full z-20 pointer-events-none select-none"
              style={{
                top: '50%', left: '10%',
                border: `1px solid ${NEON_BORDER}`,
                background: NEON_DIM,
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: NEON }} />
              {user ? user.username : 'Steve'}
              {user?.role === 'admin' && (
                <span style={{
                  marginLeft: '4px',
                  padding: '1px 5px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: 'rgba(251,191,36,0.12)',
                  color: '#FBBF24',
                  border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: '4px',
                }}>ADMIN</span>
              )}
            </div>

            {/* Elliptical ground glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
              width: '260px', height: '60px',
              background: `radial-gradient(ellipse, rgba(0,255,127,0.18) 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }} />

            {/* Outer soft glow ring behind character */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
              width: '380px', height: '55vh',
              background: `radial-gradient(ellipse at 50% 100%, rgba(0,255,127,0.05) 0%, transparent 65%)`,
            }} />

            <PlayerSkin3D
              skinUrl={skinUrl}
              width={300}
              height={560}
              animation="idle"
              mouseTrack={true}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
