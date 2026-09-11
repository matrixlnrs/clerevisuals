import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ScribbleLogo } from './ScribbleLogo'
import { useLanguage  } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

// ── Web3Forms key ─────────────────────────────────────────────────────────────
// 1. Go to https://web3forms.com/
// 2. Enter mathis.lenoraisclere@gmail.com and click "Create Access Key"
// 3. Paste the key you receive below (looks like: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")
const WEB3FORMS_KEY = '1e91a5f4-0d65-49fe-83b1-6f45f2cd73a1'
// ─────────────────────────────────────────────────────────────────────────────

export function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', sport: '', message: '' })
  const [submitted, setSub]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(false)
  const sectionRef = useRef(null)
  const { t }      = useLanguage()

  // ── Spam defences ───────────────────────────────────────────────────────
  // Two cheap checks, no CAPTCHA. A real visitor never sees or touches either.
  //   botcheck — a field hidden from people; scripted form-fillers fill it in.
  //              Web3Forms rejects the submission when it arrives non-empty.
  //   mountedAt — bots post the instant they parse the page. Nobody writes a
  //              project brief in under three seconds.
  const [botcheck, setBotcheck] = useState('')
  const mountedAt = useRef(Date.now())
  const MIN_FILL_MS = 3000

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }))

  // Derived from translations so labels always match current language
  const FIELDS = [
    { name: 'name',  label: t('contact.field.name'),  type: 'text',  required: true  },
    { name: 'email', label: t('contact.field.email'), type: 'email', required: true  },
    { name: 'sport', label: t('contact.field.sport'), type: 'text',  required: false },
  ]

  // ── Section reveal ─────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.contact-item'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="bg-surface-dark border-t border-edge py-24">
      <div className="max-w-2xl mx-auto px-6">

        {/* ── Heading ─────────────────────────────────── */}
        <div className="mb-16">
          <span className="reveal contact-item block font-sans text-[10px] text-[#F5620A] tracking-[0.38em] uppercase mb-4" style={{ opacity: 0 }}>
            {t('contact.label')}
          </span>
          <h2 className="reveal contact-item font-serif text-4xl md:text-5xl font-light text-ink mb-5" style={{ opacity: 0 }}>
            {t('contact.heading')}
          </h2>
          <div className="reveal contact-item w-10 h-px bg-[#F5620A]" style={{ opacity: 0 }} />
        </div>

        {submitted ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="flex justify-center mb-8">
              <ScribbleLogo size={68} />
            </div>
            <p className="font-serif text-2xl font-light text-ink mb-3">{t('contact.sent')}</p>
            <p className="font-sans font-light text-sm text-ink-dimmer">{t('contact.followup')}</p>
          </div>
        ) : (
          <form
            onSubmit={async e => {
              e.preventDefault()

              // Drop silently: showing a bot an error just tells it to retry.
              if (botcheck || Date.now() - mountedAt.current < MIN_FILL_MS) {
                setSub(true)
                return
              }

              setLoading(true)
              setError(false)
              try {
                const res = await fetch('https://api.web3forms.com/submit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                  body: JSON.stringify({
                    access_key:  WEB3FORMS_KEY,
                    botcheck,
                    from_name:   'Clerevisuals Website',
                    subject:     `[Clerevisuals] Message from ${form.name}`,
                    replyto:     form.email,
                    name:        form.name,
                    email:       form.email,
                    sport:       form.sport || '—',
                    message:     form.message,
                  }),
                })
                const json = await res.json()
                if (json.success) { setSub(true) } else { setError(true) }
              } catch { setError(true) }
              finally  { setLoading(false) }
            }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {FIELDS.map(field => (
                <div
                  key={field.name}
                  className="reveal contact-item group border-b border-edge-soft pb-3 transition-colors duration-300 focus-within:border-ink-dim"
                  style={{ opacity: 0 }}
                >
                  <label className="block font-sans text-[9px] text-ink-dim tracking-[0.32em] uppercase mb-3 group-focus-within:text-ink-muted transition-colors">
                    {field.label}
                    {field.required && <span className="text-[#F5620A] ml-1" aria-hidden="true">*</span>}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.name]}
                    onChange={set(field.name)}
                    required={field.required}
                    placeholder="—"
                    className="w-full bg-transparent font-sans font-light text-sm text-ink outline-none placeholder-ink-faint caret-[#F5620A]"
                  />
                </div>
              ))}
            </div>

            <div className="reveal contact-item group border-b border-edge-soft pb-3 transition-colors duration-300 focus-within:border-ink-dim" style={{ opacity: 0 }}>
              <label className="block font-sans text-[9px] text-ink-dim tracking-[0.32em] uppercase mb-3 group-focus-within:text-ink-muted transition-colors">
                {t('contact.field.msg')} <span className="text-[#F5620A]" aria-hidden="true">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={set('message')}
                required
                rows={4}
                placeholder={t('contact.placeholder')}
                className="w-full bg-transparent font-sans font-light text-sm text-ink outline-none resize-none placeholder-ink-dimmer caret-[#F5620A] leading-relaxed"
              />
            </div>

            {/* Honeypot — hidden from sight, from screen readers and from the
                tab order, so only a script will ever put anything in it. */}
            <input
              type="text"
              name="botcheck"
              value={botcheck}
              onChange={e => setBotcheck(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {error && (
              <p role="alert" className="font-sans text-[10px] text-red-400 tracking-[0.25em] uppercase">
                {t('contact.error')}
              </p>
            )}

            <div className="reveal contact-item" style={{ opacity: 0 }}>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center gap-5 font-sans text-[10px] tracking-[0.38em] uppercase text-ink hover:text-[#F5620A] transition-colors duration-300 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>{loading ? '…' : t('contact.submit')}</span>
                <span className="h-px w-10 bg-current transition-all duration-500 group-hover:w-20" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
