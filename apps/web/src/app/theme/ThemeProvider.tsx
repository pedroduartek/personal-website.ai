import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  preference: Theme | null
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'pedroduartek-theme'
const THEME_META_COLORS: Record<Theme, string> = {
  light: '#f4f7fb',
  dark: '#151b23',
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(storedTheme) ? storedTheme : null
  } catch {
    return null
  }
}

function getBootstrappedTheme(): Theme | null {
  if (typeof document === 'undefined') return null

  const bootstrappedTheme = document.documentElement.dataset.theme ?? null
  return isTheme(bootstrappedTheme) ? bootstrappedTheme : null
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  root.style.colorScheme = theme

  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  themeColorMeta?.setAttribute('content', THEME_META_COLORS[theme])
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Theme | null>(() => {
    return getStoredTheme()
  })
  const [fallbackTheme, setFallbackTheme] = useState<Theme>(() => {
    return getBootstrappedTheme() ?? 'dark'
  })

  const theme = preference ?? fallbackTheme

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if (preference) {
        window.localStorage.setItem(THEME_STORAGE_KEY, preference)
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY)
      }
    } catch {}
  }, [preference])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return

      if (isTheme(event.newValue)) {
        setPreference(event.newValue)
        return
      }

      setPreference(null)
      setFallbackTheme('dark')
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        preference,
        setTheme: (nextTheme) => {
          setPreference(nextTheme)
        },
        toggleTheme: () => {
          setPreference(theme === 'dark' ? 'light' : 'dark')
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}

export { THEME_STORAGE_KEY }
