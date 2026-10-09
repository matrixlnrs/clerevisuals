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
 * The intro plays on every load. It is the first thing the site says, and the
 * stopwatch is short enough not to wear out its welcome; skipping it on a
 * reload mostly just makes the site look like it failed to start.
 *
 * The one exception is a visitor who asked for reduced motion — they get
 * straight to the work.
 */
function shouldSkipIntro() {
  return prefersReducedMotion()
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
        <Loader onComplete={() => setReady(true)} />
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
