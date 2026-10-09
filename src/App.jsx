import { useState             } from 'react'
import { prefersReducedMotion } from './utils/motion'
import { ThemeProvider        } from './contexts/ThemeContext'
import { LanguageProvider     } from './contexts/LanguageContext'
import { useLenis             } from './hooks/useLenis'
import { Loader               } from './components/Loader'
import { Cursor               } from './components/Cursor'
import { Header               } from './components/Header'
import { Hero                 } from './components/Hero'
import { Showcase             } from './components/Showcase'
import { Gallery              } from './components/Gallery'
import { Brands               } from './components/Brands'
import { Testimonials         } from './components/Testimonials'
import { About                } from './components/About'
import { Contact              } from './components/Contact'
import { Footer               } from './components/Footer'

/**
 * The intro plays once, on the first load, and is skipped on every reload
 * after that — sitting through the same stopwatch each time you come back to
 * a tab gets old fast.
 *
 * sessionStorage, not localStorage, is what sets "once" here: the flag dies
 * with the tab, so someone returning tomorrow is greeted properly rather than
 * dropped straight onto the page. Swap it for localStorage if you would
 * rather a visitor only ever see it a single time.
 *
 * A visitor who asked for reduced motion never sees it at all.
 */
function shouldSkipIntro() {
  if (prefersReducedMotion()) return true
  try {
    return sessionStorage.getItem('clere-intro') === 'seen'
  } catch {
    // Private mode or blocked storage — just play it.
    return false
  }
}

function markIntroSeen() {
  try { sessionStorage.setItem('clere-intro', 'seen') } catch { /* not essential */ }
}

function Portfolio() {
  // `ready` gates Hero entrance animations so they fire *after*
  // the curtain reveals — not silently beneath it.
  const [ready, setReady] = useState(shouldSkipIntro)

  useLenis() // boots Lenis + syncs with GSAP ScrollTrigger

  return (
    <>
      {/* Cinematic intro — unmounts once onComplete fires */}
      {!ready && (
        <Loader onComplete={() => { markIntroSeen(); setReady(true) }} />
      )}

      {/* Portfolio — always mounted so GSAP / ScrollTrigger can initialise */}
      <div className="bg-surface">
        <Cursor />
        <Header />
        <Hero triggerAnimation={ready} />
        <div id="showcase">
          <Showcase />
        </div>
        <Gallery />
        <Brands />
        <Testimonials />
        <About />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Portfolio />
      </LanguageProvider>
    </ThemeProvider>
  )
}
