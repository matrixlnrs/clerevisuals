/**
 * Brands — infinite dual-row marquee of client / collaboration names.
 * Hover pauses the animation. Edit BRANDS to add your own clients.
 */
import { useLanguage } from '../contexts/LanguageContext'

// ── Edit your clients / collaborations here ───────────────────────────────
const BRANDS = [
  'Circuit Paul Ricard',
  'Brad Benavides',
  'Sunset Bike',
  'Sunset Run',
  'Dubrocrunner',
  'Toulon Métropole Athlétisme',
  'BDE ISEN Toulon',
  'Fédération Française d\'Athlétisme',
  'Natif Festival',
]

// Split into two rows so each marquee has a different selection
const ROW_A = BRANDS
const ROW_B = [...BRANDS.slice(6), ...BRANDS.slice(0, 6)]

// Each row is duplicated so the loop is seamless
function MarqueeRow({ items, reverse = false, duration = '38s' }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden">
      <div
        className={`marquee-track flex items-center whitespace-nowrap ${reverse ? 'marquee-rtl' : 'marquee-ltr'}`}
        style={{ animationDuration: duration, width: 'max-content' }}
      >
        {doubled.map((name, i) => (
          <span key={i} className="inline-flex items-center gap-0">
            <span className="font-sans text-[11px] tracking-[0.42em] uppercase text-ink-dimmer
              hover:text-ink transition-colors duration-300 px-10 cursor-default">
              {name}
            </span>
            <span className="text-[#F5620A] opacity-25 text-[10px] select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Brands() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-surface border-t border-edge marquee-section">

      {/* Header */}
      <div className="px-8 lg:px-16 mb-14 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-6 h-px bg-[#F5620A]" />
            <span className="font-sans text-[10px] text-[#F5620A] tracking-[0.38em] uppercase">
              {t('brands.label')}
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-ink leading-tight">
            {t('brands.heading1')}<br />
            <span className="text-ink-dimmer italic">{t('brands.heading2')}</span>
          </h2>
        </div>

        {/* Count */}
        <span className="font-sans text-[10px] text-ink-faint tracking-[0.2em] hidden md:block">
          {String(BRANDS.length).padStart(2, '0')} {t('brands.count')}
        </span>
      </div>

      {/* Dual marquee */}
      <div className="space-y-0">
        <div className="border-y border-edge py-5">
          <MarqueeRow items={ROW_A} duration="42s" />
        </div>
        <div className="border-b border-edge py-5">
          <MarqueeRow items={ROW_B} reverse duration="54s" />
        </div>
      </div>

    </section>
  )
}
