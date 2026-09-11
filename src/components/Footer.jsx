import { ScribbleLogo } from './ScribbleLogo'
import { useLanguage  } from '../contexts/LanguageContext'

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/clerevisuals/' },
  { label: 'Flickr',    href: 'https://www.flickr.com/photos/clerephotography/albums/' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/mathis-lenorais-clere-06a149272/' },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-surface-dark border-t border-edge py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-3">
          <ScribbleLogo size={30} />
          <span className="font-sans text-[10px] font-light text-ink-dim tracking-[0.38em] uppercase">
            Clerevisuals
          </span>
        </div>

        <nav className="flex items-center gap-8" aria-label="Social links">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[9px] text-ink-dim hover:text-[#F5620A] tracking-[0.22em] uppercase transition-colors duration-200"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <p className="font-sans text-[9px] text-ink-dimmer tracking-[0.15em]">
          © 2025 {t('footer.copy')}
        </p>
      </div>
    </footer>
  )
}
