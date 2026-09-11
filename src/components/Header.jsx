import { useState, useEffect } from 'react'
import { ScribbleLogo  } from './ScribbleLogo'
import { useTheme      } from '../contexts/ThemeContext'
import { useLanguage   } from '../contexts/LanguageContext'

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12"    y1="2"     x2="12"    y2="5"     />
      <line x1="12"    y1="19"    x2="12"    y2="22"    />
      <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"     y1="12"    x2="5"     y2="12"    />
      <line x1="19"    y1="12"    x2="22"    y2="12"    />
      <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
      <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function smoothTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function Header() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme }      = useTheme()
  const { lang, switchLang, t }     = useLanguage()

  const NAV = [
    { labelKey: 'nav.gallery', id: 'gallery' },
    { labelKey: 'nav.about',   id: 'about'   },
    { labelKey: 'nav.contact', id: 'contact' },
  ]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // When transparent the header sits over the hero photo (always dark in dark theme).
  // In light theme the hero has a cream/off-white background so we must use dark
  // ink tokens to stay legible — white text would be invisible there.
  const isLight = theme === 'light'

  const navCls  = scrolled || isLight
    ? 'text-ink-muted hover:text-ink'
    : 'text-white/70 hover:text-white'

  const iconCls = scrolled || isLight
    ? 'text-ink-muted hover:text-[#F5620A]'
    : 'text-white/70 hover:text-[#F5620A]'

  const dividerBg = scrolled || isLight ? 'bg-edge' : 'bg-white'

  return (
    <>
      {/* ── Fixed top bar ─────────────────────────────── */}
      {/* NOTE: bg-surface/90 doesn't work with CSS-variable colours in Tailwind
               (needs RGB channels). Use inline style for the background instead. */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[border-color,backdrop-filter] duration-500 ${
          scrolled ? 'backdrop-blur-md border-b border-edge' : ''
        }`}
        style={scrolled
          ? { backgroundColor: 'rgb(var(--surface-rgb) / 0.92)' }
          : { backgroundColor: 'transparent' }
        }
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group cursor-pointer"
            aria-label="Back to top"
          >
            <ScribbleLogo size={34} />
            {/* text-ink/70 breaks with CSS variables — use ink-muted instead */}
            <span className={`font-sans text-[11px] font-light tracking-[0.42em] uppercase transition-colors duration-300 ${
              scrolled || isLight
                ? 'text-ink-muted group-hover:text-ink'
                : 'text-white/85 group-hover:text-white'
            }`}>
              Clerevisuals
            </span>
          </button>

          {/* Right-side controls */}
          <div className="flex items-center gap-5">

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
              {NAV.map(link => (
                <button
                  key={link.id}
                  onClick={() => smoothTo(link.id)}
                  className={`font-sans text-[10px] font-light tracking-[0.28em] uppercase transition-colors duration-200 cursor-pointer ${navCls}`}
                >
                  {t(link.labelKey)}
                </button>
              ))}
            </nav>

            {/* Divider — desktop only */}
            <div className={`hidden md:block w-px h-3.5 opacity-40 ${dividerBg}`} />

            {/* Language toggle */}
            <div className="flex items-center gap-1.5" role="group" aria-label="Language">
              <button
                onClick={() => switchLang('en')}
                className={`font-sans text-[10px] tracking-[0.22em] uppercase transition-colors duration-200 cursor-pointer ${
                  lang === 'en'
                    ? 'text-[#F5620A]'
                    : navCls
                }`}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <span className={`text-[9px] select-none ${scrolled || isLight ? 'text-edge-soft' : 'text-white/35'}`}>·</span>
              <button
                onClick={() => switchLang('fr')}
                className={`font-sans text-[10px] tracking-[0.22em] uppercase transition-colors duration-200 cursor-pointer ${
                  lang === 'fr'
                    ? 'text-[#F5620A]'
                    : navCls
                }`}
                aria-pressed={lang === 'fr'}
              >
                FR
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`transition-colors duration-200 cursor-pointer ${iconCls}`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Hamburger — mobile only */}
            {/* bg-ink/60 breaks with CSS variables — use ink-muted (already muted) */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer group"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <span className={`block w-6 h-px transition-colors group-hover:bg-[#F5620A] ${
                scrolled || isLight ? 'bg-ink-muted' : 'bg-white/75'
              }`} />
              <span className={`block w-4 h-px transition-colors group-hover:bg-[#F5620A] ${
                scrolled || isLight ? 'bg-ink-muted' : 'bg-white/75'
              }`} />
            </button>

          </div>
        </div>
      </header>

      {/* ── Full-screen mobile menu (always dark — cinematic) ── */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0E0E0E] flex flex-col transition-opacity duration-400 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between px-6 py-5">
          <ScribbleLogo size={34} />
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/40 hover:text-white transition-colors p-2 cursor-pointer"
            aria-label="Close navigation"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="17" y1="5"  x2="5"  y2="17" />
              <line x1="5"  y1="5"  x2="17" y2="17" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 flex flex-col items-center justify-center gap-10">
          {NAV.map((link, i) => (
            <button
              key={link.id}
              onClick={() => {
                setMobileOpen(false)
                setTimeout(() => smoothTo(link.id), 320)
              }}
              className="font-serif text-4xl font-light text-white hover:text-[#F5620A] transition-colors duration-300 cursor-pointer"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {t(link.labelKey)}
            </button>
          ))}
        </nav>

        {/* Mobile bottom — lang + theme + tagline */}
        <div className="pb-10 flex flex-col items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" role="group" aria-label="Language">
              <button
                onClick={() => switchLang('en')}
                className={`font-sans text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-colors ${
                  lang === 'en' ? 'text-[#F5620A]' : 'text-white/30 hover:text-white/60'
                }`}
              >
                EN
              </button>
              <span className="text-white/20 text-[9px]">·</span>
              <button
                onClick={() => switchLang('fr')}
                className={`font-sans text-[10px] tracking-[0.25em] uppercase cursor-pointer transition-colors ${
                  lang === 'fr' ? 'text-[#F5620A]' : 'text-white/30 hover:text-white/60'
                }`}
              >
                FR
              </button>
            </div>
            <div className="w-px h-3 bg-white/15" />
            <button
              onClick={toggleTheme}
              className="text-white/30 hover:text-[#F5620A] transition-colors cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
          <p className="font-sans text-[9px] text-neutral-700 tracking-[0.35em] uppercase">
            Provence · France
          </p>
        </div>
      </div>
    </>
  )
}
