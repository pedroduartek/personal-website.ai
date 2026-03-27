import { Suspense, forwardRef, useEffect, useRef, useState } from 'react'
import {
  Link,
  Outlet,
  NavLink as RouterNavLink,
  useLocation,
} from 'react-router-dom'
import ChatWidget from '../../components/ChatWidget'
import { CommandPalette } from '../../components/CommandPalette'
import CommandPaletteTip from '../../components/CommandPalette/CommandPaletteTip'
import SiteContainer from '../../components/SiteContainer'
import ThemeToggle from '../../components/ThemeToggle'
import { useCommandPalette } from '../../hooks/useCommandPalette'
import {
  isKeyboardCapableDevice,
  resolveHeaderLayout,
} from '../../utils/headerLayout'
import { useTheme } from '../theme/ThemeProvider'

const logo = '/pld_logo_header.webp'
// Keep this aligned with the HeaderCommandButton `ml-[7.5rem]` class.
const HEADER_COMMAND_BUTTON_OFFSET = 120

const desktopHeaderLinks = [
  { to: '/about', label: 'About', icon: 'profile' },
  { to: '/experience', label: 'Experience', icon: 'briefcase' },
  { to: '/projects', label: 'Projects', icon: 'grid' },
  { to: '/education', label: 'Education', icon: 'book' },
  { to: '/skills', label: 'Skills', icon: 'spark' },
  { to: '/contact', label: 'Contact', icon: 'chat' },
] as const

const mobileHeaderLinks = [
  { to: '/about', label: 'About Me' },
  { to: '/experience', label: 'Professional Experience' },
  { to: '/projects', label: 'Personal Projects' },
  { to: '/education', label: 'Education' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contacts' },
] as const

export default function AppLayout() {
  const { isOpen, close, open } = useCommandPalette()
  const location = useLocation()
  const isTerminalRoute = location.pathname === '/terminal'

  const lastUpdated = import.meta.env.VITE_LAST_UPDATED ?? null
  return (
    <div
      className={`flex flex-col bg-background ${
        isTerminalRoute ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <Header isTerminalRoute={isTerminalRoute} onOpenCommandPalette={open} />
      <main
        className={`flex flex-1 min-h-0 ${isTerminalRoute ? 'overflow-hidden' : ''}`}
      >
        {isTerminalRoute ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center py-16">
                  <div className="text-foreground-muted">Loading...</div>
                </div>
              }
            >
              <div
                key={location.pathname}
                className="animate-route-panel-enter"
              >
                <Outlet />
              </div>
            </Suspense>
          </div>
        ) : (
          <SiteContainer className="flex-1">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-16">
                  <div className="text-foreground-muted">Loading...</div>
                </div>
              }
            >
              <div
                key={location.pathname}
                className="animate-route-panel-enter"
              >
                <Outlet />
              </div>
            </Suspense>
          </SiteContainer>
        )}
      </main>
      <footer className="bg-header py-4 text-center text-xs text-foreground-subtle">
        {lastUpdated ? `Last updated: ${lastUpdated}` : null}
      </footer>
      <CommandPalette isOpen={isOpen} onClose={close} />
      {!isTerminalRoute && <ChatWidget />}
    </div>
  )
}

function Header({
  isTerminalRoute,
  onOpenCommandPalette,
}: {
  isTerminalRoute: boolean
  onOpenCommandPalette: () => void
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerLayout, setHeaderLayout] = useState(() => ({
    showCommandButton: false,
    showDesktopNav: true,
  }))
  const { theme } = useTheme()
  const navRowRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const commandMeasureRef = useRef<HTMLButtonElement>(null)
  const desktopControlsMeasureRef = useRef<HTMLDivElement>(null)
  const isMac =
    typeof navigator !== 'undefined' &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

  useEffect(() => {
    const updateLayout = () => {
      if (
        !navRowRef.current ||
        !logoRef.current ||
        !commandMeasureRef.current ||
        !desktopControlsMeasureRef.current
      ) {
        return
      }

      const nextLayout = resolveHeaderLayout({
        commandButtonWidth:
          commandMeasureRef.current.getBoundingClientRect().width +
          HEADER_COMMAND_BUTTON_OFFSET,
        containerWidth: navRowRef.current.clientWidth,
        desktopControlsWidth:
          desktopControlsMeasureRef.current.getBoundingClientRect().width,
        keyboardCapable: isKeyboardCapableDevice(),
        logoWidth: logoRef.current.getBoundingClientRect().width,
      })

      setHeaderLayout((previousLayout) =>
        previousLayout.showCommandButton === nextLayout.showCommandButton &&
        previousLayout.showDesktopNav === nextLayout.showDesktopNav
          ? previousLayout
          : nextLayout,
      )
    }

    updateLayout()

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateLayout)
        : null

    const observedElements = [
      navRowRef.current,
      logoRef.current,
      commandMeasureRef.current,
      desktopControlsMeasureRef.current,
    ]

    for (const element of observedElements) {
      if (element) {
        resizeObserver?.observe(element)
      }
    }

    const mediaQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
        : null

    const onMediaQueryChange = () => updateLayout()
    const addMediaListener = mediaQuery?.addEventListener?.bind(mediaQuery)
    const removeMediaListener =
      mediaQuery?.removeEventListener?.bind(mediaQuery)
    const addLegacyMediaListener = mediaQuery?.addListener?.bind(mediaQuery)
    const removeLegacyMediaListener =
      mediaQuery?.removeListener?.bind(mediaQuery)

    window.addEventListener('resize', updateLayout)
    if (addMediaListener && removeMediaListener) {
      addMediaListener('change', onMediaQueryChange)
    } else if (addLegacyMediaListener && removeLegacyMediaListener) {
      addLegacyMediaListener(onMediaQueryChange)
    }

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateLayout)
      if (removeMediaListener) {
        removeMediaListener('change', onMediaQueryChange)
      } else if (removeLegacyMediaListener) {
        removeLegacyMediaListener(onMediaQueryChange)
      }
    }
  }, [])

  useEffect(() => {
    if (headerLayout.showDesktopNav) {
      setIsMenuOpen(false)
    }
  }, [headerLayout.showDesktopNav])

  if (isTerminalRoute) {
    return (
      <header className="bg-header">
        <nav className="flex items-center justify-between gap-4 px-3 py-2 2xl:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold text-foreground"
          >
            <img
              src={logo}
              alt="PLD Logo"
              className={`h-[70px] w-auto transition-[filter] ${
                theme === 'light' ? 'brightness-0' : ''
              }`}
              width={70}
              height={70}
              fetchPriority="high"
              decoding="sync"
            />
            PEDRODUARTEK
          </Link>
          <ThemeToggle />
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-header">
      <nav className="relative px-3 py-2 2xl:px-6">
        <div ref={navRowRef} className="flex items-center gap-4">
          <Link
            ref={logoRef}
            to="/"
            className="flex shrink-0 items-center gap-3 text-xl font-bold text-foreground"
          >
            <img
              src={logo}
              alt="PLD Logo"
              className={`h-[70px] w-auto transition-[filter] ${
                theme === 'light' ? 'brightness-0' : ''
              }`}
              width={70}
              height={70}
              fetchPriority="high"
              decoding="sync"
            />
            <span className="text-lg sm:text-xl">PEDRODUARTEK</span>
          </Link>

          {headerLayout.showCommandButton ? (
            <div className="relative">
              <HeaderCommandButton
                id="command-palette-button"
                isMac={isMac}
                onClick={() => {
                  try {
                    if (typeof window !== 'undefined')
                      localStorage.setItem('commandPaletteTipDismissed', '1')
                  } catch (e) {
                    // ignore
                  }
                  onOpenCommandPalette()
                }}
              />

              <CommandPaletteTip />
            </div>
          ) : null}

          <div className="ml-auto flex shrink-0 items-center gap-3">
            {headerLayout.showDesktopNav ? <HeaderDesktopNavGroup /> : null}

            <ThemeToggle className="rounded-full border-border/80 bg-surface-muted/70 hover:bg-surface" />

            {!headerLayout.showDesktopNav ? (
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface-muted/80 p-2 text-foreground-muted transition-all duration-200 hover:border-border-strong hover:bg-surface hover:text-foreground"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  role="img"
                  aria-label="Menu icon"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        <div
          className="pointer-events-none fixed left-0 top-0 -z-10 invisible whitespace-nowrap"
          aria-hidden="true"
        >
          <HeaderCommandButton ref={commandMeasureRef} isMac={isMac} measure />
          <div
            ref={desktopControlsMeasureRef}
            className="mt-4 flex items-center gap-3"
          >
            <HeaderDesktopNavGroup measure />
            <ThemeToggle className="rounded-full border-border/80 bg-surface-muted/70 hover:bg-surface" />
          </div>
        </div>

        {isMenuOpen && !headerLayout.showDesktopNav ? (
          <div className="mt-4 rounded-[1.5rem] border border-border bg-surface p-3 shadow-lg shadow-slate-950/5">
            <Link
              to="/cv"
              onClick={() => setIsMenuOpen(false)}
              className="mb-2 inline-flex w-full items-center justify-start rounded-md px-2 py-2 text-sm font-semibold text-chat transition-colors duration-200 hover:text-blue-700"
            >
              Download CV
            </Link>

            <div className="flex flex-col gap-1">
              {mobileHeaderLinks.map((link) => (
                <MobileNavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </MobileNavLink>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}

function HeaderNavLink({
  to,
  children,
  icon,
}: {
  to: string
  children: React.ReactNode
  icon: (typeof desktopHeaderLinks)[number]['icon']
}) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex min-w-[76px] flex-col items-center justify-center gap-1 border-b-[3px] px-3 pb-[11px] pt-2 text-center text-[11px] font-medium leading-none transition-colors duration-200 ${
          isActive
            ? 'border-foreground text-foreground'
            : 'border-transparent text-foreground-subtle hover:text-foreground'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex h-6 items-center justify-center">
            <HeaderNavIcon icon={icon} isActive={isActive} />
          </span>
          <span className="text-[11px] leading-none">{children}</span>
        </>
      )}
    </RouterNavLink>
  )
}

function HeaderNavIcon({
  icon,
  isActive,
}: {
  icon: (typeof desktopHeaderLinks)[number]['icon']
  isActive: boolean
}) {
  const className = `h-5 w-5 ${isActive ? 'text-foreground' : 'text-current'}`

  switch (icon) {
    case 'profile':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'briefcase':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M9 4.5A2.5 2.5 0 0 1 11.5 2h1A2.5 2.5 0 0 1 15 4.5V6h3A2 2 0 0 1 20 8v8.5A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5V8a2 2 0 0 1 2-2h3V4.5Zm1.5 0V6h3V4.5a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5Zm-4.5 6v6a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-6h-4v1h-4v-1H6Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'grid':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'book':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M6.5 4A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H19V4H6.5Zm0 2H17v12H6.5a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Zm2 2h5v1.5h-5V8Zm0 3h7v1.5h-7V11Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'spark':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Zm6 11 1 2.8L22 17l-3 1.2L18 21l-1.2-2.8L14 17l2.8-1.2L18 13ZM6 14l1 2.3L9.3 17 7 17.7 6 20l-.8-2.3L3 17l2.2-.7L6 14Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'chat':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v6A2.5 2.5 0 0 1 16.5 14H11l-4.5 3v-3H7.5A2.5 2.5 0 0 1 5 11.5v-6Zm3 2.25h8V9H8V7.75Zm0 3h5v1.25H8v-1.25Z"
            fill="currentColor"
          />
        </svg>
      )
  }
}

function MobileNavLink({
  to,
  children,
  onClick,
}: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `inline-flex items-center border-b border-transparent px-2 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'border-border text-foreground'
            : 'text-foreground-muted hover:text-foreground'
        }`
      }
    >
      {children}
    </RouterNavLink>
  )
}

type HeaderCommandButtonProps = {
  id?: string
  isMac: boolean
  measure?: boolean
  onClick?: () => void
}

const HeaderCommandButton = forwardRef<
  HTMLButtonElement,
  HeaderCommandButtonProps
>(function HeaderCommandButton({ id, isMac, measure = false, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      id={measure ? undefined : id}
      onClick={measure ? undefined : onClick}
      className="ml-[7.5rem] inline-flex w-[18rem] items-center gap-3 rounded-full border border-border bg-surface-muted/90 px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface hover:text-foreground min-[1600px]:w-[21rem]"
      aria-label={measure ? undefined : 'Open commands'}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 7l4.5 5L5 17"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.5 17H19"
          />
        </svg>
        <span className="truncate">Commands</span>
      </span>
      <kbd className="theme-kbd hidden border-0 bg-surface px-1.5 py-0.5 sm:inline-flex">
        {isMac ? '⌘K' : 'Ctrl+K'}
      </kbd>
    </button>
  )
})

type HeaderDesktopNavGroupProps = {
  measure?: boolean
}

function HeaderDesktopNavGroup({
  measure = false,
}: HeaderDesktopNavGroupProps) {
  if (measure) {
    return (
      <div className="flex items-center gap-5">
        <div className="flex items-stretch gap-1 pl-3">
          {desktopHeaderLinks.map((link) => (
            <div
              key={link.to}
              className="inline-flex min-w-[76px] flex-col items-center justify-center gap-1 border-b-[3px] border-transparent px-3 pb-[11px] pt-2 text-center text-[11px] font-medium leading-none text-foreground-subtle"
            >
              <span className="flex h-6 items-center justify-center">
                <HeaderNavIcon icon={link.icon} isActive={false} />
              </span>
              <span className="text-[11px] leading-none">{link.label}</span>
            </div>
          ))}
        </div>

        <span className="inline-flex min-h-[72px] items-center rounded-2xl px-3 py-2 text-sm font-semibold text-chat">
          Download CV
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-stretch gap-1 pl-3">
        {desktopHeaderLinks.map((link) => (
          <HeaderNavLink key={link.to} to={link.to} icon={link.icon}>
            {link.label}
          </HeaderNavLink>
        ))}
      </div>

      <Link
        to="/cv"
        className="inline-flex min-h-[72px] items-center rounded-2xl px-3 py-2 text-sm font-semibold text-chat transition-colors duration-200 hover:text-blue-700"
      >
        Download CV
      </Link>
    </div>
  )
}
