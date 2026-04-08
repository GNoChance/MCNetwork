import { useState, FormEvent } from 'react'
import { Header } from '@/components/layout/Header'
import styles from './Contact.module.css'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const CONTACT_INFO = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: 'Email',
    value: 'contact@mcnetwork.fr',
    href: 'mailto:contact@mcnetwork.fr',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    ),
    label: 'Discord',
    value: 'discord.gg/mcnetwork',
    href: 'https://discord.gg/mcnetwork',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Serveur',
    value: 'play.mcnetwork.fr',
    href: null,
  },
]

const SUBJECTS = [
  'Support technique',
  'Signaler un bug',
  'Partenariat',
  'Question générale',
  'Autre',
]

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<Status>('idle')

  const validate = (): boolean => {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = 'Champ requis'
    if (!form.email.trim()) {
      next.email = 'Champ requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Email invalide'
    }
    if (!form.subject) next.subject = 'Sélectionne un sujet'
    if (!form.message.trim()) next.message = 'Champ requis'
    else if (form.message.trim().length < 20) next.message = 'Minimum 20 caractères'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    // Simulated send — replace with your API call
    await new Promise((r) => setTimeout(r, 1400))
    setStatus('sent')
  }

  return (
    <div className={styles.page}>
      <Header />
      {/* Background grid */}
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Contact
          </div>
          <h1 className={styles.title}>Parle-nous</h1>
          <p className={styles.subtitle}>
            Une question, un bug, une idée ?<br />
            L'équipe MCNetwork te répond dans les 24h.
          </p>
        </header>

        {/* Main grid */}
        <main className={styles.main}>
          {/* Left — info panel */}
          <aside className={styles.infoPanel}>
            <div className={styles.infoCard}>
              <p className={styles.infoIntro}>
                Rejoins notre communauté ou contacte-nous directement, on est là.
              </p>

              <ul className={styles.infoList} role="list">
                {CONTACT_INFO.map(({ icon, label, value, href }) => (
                  <li key={label} className={styles.infoItem}>
                    <span className={styles.infoIcon} aria-hidden="true">{icon}</span>
                    <div>
                      <span className={styles.infoLabel}>{label}</span>
                      {href ? (
                        <a
                          href={href}
                          className={styles.infoValue}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {value}
                        </a>
                      ) : (
                        <span className={styles.infoValue}>{value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Map placeholder */}
              <div className={styles.mapPlaceholder} role="img" aria-label="Carte interactive placeholder">
                <div className={styles.mapGrid} aria-hidden="true" />
                <div className={styles.mapPin} aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Paris, France</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right — form */}
          <section className={styles.formSection} aria-label="Formulaire de contact">
            {status === 'sent' ? (
              <div className={styles.successCard} role="status">
                <div className={styles.successIcon} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Message envoyé !</h2>
                <p className={styles.successText}>
                  On a bien reçu ton message. L'équipe te répondra sous 24h sur <strong>{form.email}</strong>.
                </p>
                <button
                  className={styles.btnSecondary}
                  onClick={() => {
                    setForm({ name: '', email: '', subject: '', message: '' })
                    setStatus('idle')
                  }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">
                      Pseudo / Nom <span aria-hidden="true" className={styles.required}>*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      placeholder="Steve"
                      value={form.name}
                      onChange={handleChange}
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby={errors.name ? 'name-err' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <span id="name-err" className={styles.fieldError} role="alert">{errors.name}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                      Email <span aria-hidden="true" className={styles.required}>*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      placeholder="steve@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      aria-required="true"
                      aria-describedby={errors.email ? 'email-err' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <span id="email-err" className={styles.fieldError} role="alert">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="subject">
                    Sujet <span aria-hidden="true" className={styles.required}>*</span>
                  </label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="subject"
                      name="subject"
                      className={`${styles.select} ${errors.subject ? styles.inputError : ''}`}
                      value={form.subject}
                      onChange={handleChange}
                      aria-required="true"
                      aria-describedby={errors.subject ? 'subject-err' : undefined}
                      aria-invalid={!!errors.subject}
                    >
                      <option value="" disabled>Choisis un sujet…</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className={styles.selectArrow} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  {errors.subject && (
                    <span id="subject-err" className={styles.fieldError} role="alert">{errors.subject}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">
                    Message <span aria-hidden="true" className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    placeholder="Décris ton problème ou ta question en détail…"
                    value={form.message}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.message ? 'message-err' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  <div className={styles.textareaFooter}>
                    {errors.message && (
                      <span id="message-err" className={styles.fieldError} role="alert">{errors.message}</span>
                    )}
                    <span className={`${styles.charCount} ${form.message.length < 20 && form.message.length > 0 ? styles.charCountWarn : ''}`}>
                      {form.message.length} / 1000
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
