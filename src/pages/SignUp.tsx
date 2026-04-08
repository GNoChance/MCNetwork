import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Gamepad2 } from 'lucide-react'

const BACKEND_URL = 'http://localhost:8080'

// ≥8 chars + au moins 1 caractère spécial
const PASSWORD_REGEX = /^(?=.*[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]).{8,}$/

type Form = { email: string; password: string; confirm: string }
type Errors = Partial<Form & { general: string }>

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères minimum',       ok: password.length >= 8 },
    { label: '1 caractère spécial (!@#…)', ok: /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]/.test(password) },
    { label: 'Lettre majuscule',            ok: /[A-Z]/.test(password) },
    { label: 'Chiffre',                     ok: /[0-9]/.test(password) },
  ]
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {checks.map(({ label, ok }) => (
        <li key={label} className={`flex items-center gap-2 text-xs transition-colors ${ok ? 'text-green-400' : 'text-white/25'}`}>
          {ok
            ? <CheckCircle2 size={11} className="shrink-0" />
            : <span className="w-[11px] h-[11px] rounded-full border border-white/15 shrink-0" />}
          {label}
        </li>
      ))}
    </ul>
  )
}

export default function SignUp() {
  const navigate = useNavigate()
  const { loginAsAdmin } = useAuth()

  const [form, setForm]         = useState<Form>({ email: '', password: '', confirm: '' })
  const [errors, setErrors]     = useState<Errors>({})
  const [showPwd, setShowPwd]   = useState(false)
  const [showCfm, setShowCfm]   = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof Errors]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validate = (): boolean => {
    const next: Errors = {}
    if (!form.email.trim())                              next.email    = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Format email invalide'
    if (!form.password)                                  next.password = 'Mot de passe requis'
    else if (!PASSWORD_REGEX.test(form.password))        next.password = 'Minimum 8 caractères dont 1 caractère spécial (!@#…)'
    if (!form.confirm)                                   next.confirm  = 'Confirmation requise'
    else if (form.confirm !== form.password)             next.confirm  = 'Les mots de passe ne correspondent pas'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200)) // remplacer par l'appel API
    setLoading(false)
    loginAsAdmin()
    navigate('/dashboard')
  }

  const handleMinecraft = () => {
    window.location.href = `${BACKEND_URL}/api/auth/microsoft`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-16">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-green-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 font-mono font-bold text-white hover:opacity-75 transition-opacity">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
          MCNetwork
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden">

          {/* Title */}
          <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
            <h1 className="text-xl font-mono font-bold text-white">Créer un compte</h1>
            <p className="text-sm text-white/35 mt-1">Rejoins la communauté MCNetwork</p>
          </div>

          <div className="p-6 flex flex-col gap-5">

            {/* Minecraft / Microsoft */}
            <button
              type="button"
              onClick={handleMinecraft}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-green-400/20 bg-green-400/[0.05] hover:bg-green-400/[0.1] hover:border-green-400/35 text-green-400 font-semibold text-sm transition-all"
            >
              <Gamepad2 size={17} />
              Continuer avec Minecraft (Microsoft)
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/20">ou avec un email</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* Classic form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    id="email" name="email" type="email" autoComplete="email"
                    placeholder="steve@example.com"
                    value={form.email} onChange={handleChange}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white/[0.03] text-sm text-white placeholder-white/15 outline-none transition-colors ${
                      errors.email ? 'border-red-500/40 focus:border-red-400' : 'border-white/10 focus:border-green-400/40'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                    <AlertCircle size={11} />{errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="password">Mot de passe</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    id="password" name="password" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border bg-white/[0.03] text-sm text-white placeholder-white/15 outline-none transition-colors ${
                      errors.password ? 'border-red-500/40 focus:border-red-400' : 'border-white/10 focus:border-green-400/40'
                    }`}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                    {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                    <AlertCircle size={11} />{errors.password}
                  </p>
                )}
                {form.password && <PasswordStrength password={form.password} />}
              </div>

              {/* Confirm */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50" htmlFor="confirm">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                  <input
                    id="confirm" name="confirm" type={showCfm ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="••••••••"
                    value={form.confirm} onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border bg-white/[0.03] text-sm text-white placeholder-white/15 outline-none transition-colors ${
                      errors.confirm ? 'border-red-500/40 focus:border-red-400' : 'border-white/10 focus:border-green-400/40'
                    }`}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowCfm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                    {showCfm ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
                    <AlertCircle size={11} />{errors.confirm}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs" role="alert">
                  <AlertCircle size={13} />{errors.general}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(74,222,128,0.2)]"
              >
                {loading ? (
                  <><span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />Création…</>
                ) : (
                  <><User size={14} />Créer mon compte</>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-xs text-white/30">
              Vous avez un compte ?{' '}
              <Link to="/login" className="text-green-400/70 hover:text-green-400 transition-colors font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
