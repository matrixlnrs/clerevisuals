import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('clere-lang')
    if (stored === 'en' || stored === 'fr') return stored
    // honour browser language if French
    const nav = navigator.language?.split('-')[0]
    return nav === 'fr' ? 'fr' : 'en'
  })

  // Keep <html lang="…"> in sync — important for accessibility + SEO
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const switchLang = (l) => {
    setLang(l)
    localStorage.setItem('clere-lang', l)
  }

  const t = (key) => translations[lang]?.[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}
