import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../app/theme/ThemeProvider'
import { aiChatHeroSlide, terminalHeroSlide } from '../content/homeHeroSlides'
import type { Project } from '../content/types'
import { useChatAvailability } from '../hooks/useChatAvailability'
import { openChatWidget } from '../utils/chatWidget'
import TechIcon from './TechIcon'

type HomeHeroCarouselProps = {
  slides: Project[]
}

type CarouselSlide = {
  slug: string
  title: string
  technologies: string[]
  href: string
  homeHero: NonNullable<Project['homeHero']>
  customMedia?: 'terminal' | 'chat'
  opensChatWidget?: boolean
  preview?: {
    label: string
    title: string
    status: string
    lines: string[]
    footer: string
  }
}

function isDesktopViewport() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.innerWidth >= 1536
}

function getInitialReducedMotionPreference() {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getSlideTheme(slug: string) {
  switch (slug) {
    case 'personal-website':
      return {
        shell:
          'from-sky-500/28 via-cyan-500/12 to-transparent dark:from-sky-500/18 dark:via-cyan-500/8 dark:to-transparent',
        halo: 'bg-sky-500/12 dark:bg-sky-500/18',
        badge: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-200',
        mediaFrame:
          'bg-sky-500/12 dark:bg-sky-500/18 border-sky-400/20 dark:border-sky-400/20',
      }
    case 'home-assistant':
      return {
        shell:
          'from-emerald-500/28 via-teal-500/12 to-transparent dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-transparent',
        halo: 'bg-emerald-500/12 dark:bg-emerald-500/18',
        badge:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
        mediaFrame:
          'bg-emerald-500/12 dark:bg-emerald-500/18 border-emerald-400/20 dark:border-emerald-400/20',
      }
    case 'ourivesaria-rinchoa':
      return {
        shell:
          'from-rose-400/24 via-amber-300/10 to-transparent dark:from-rose-400/18 dark:via-amber-300/8 dark:to-transparent',
        halo: 'bg-rose-400/12 dark:bg-rose-400/18',
        badge:
          'border-rose-400/30 bg-rose-400/10 text-rose-700 dark:text-rose-200',
        mediaFrame:
          'bg-rose-400/12 dark:bg-rose-400/16 border-rose-300/20 dark:border-rose-300/20',
      }
    case 'ai-chat-api':
      return {
        shell:
          'from-blue-600/28 via-indigo-500/12 to-transparent dark:from-blue-500/22 dark:via-indigo-500/10 dark:to-transparent',
        halo: 'bg-blue-500/12 dark:bg-blue-500/18',
        badge:
          'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-200',
        mediaFrame:
          'bg-blue-500/12 dark:bg-blue-500/18 border-blue-400/20 dark:border-blue-400/20',
      }
    case 'ai-chat-feature':
      return {
        shell:
          'from-fuchsia-500/24 via-pink-500/10 to-transparent dark:from-fuchsia-500/18 dark:via-pink-500/8 dark:to-transparent',
        halo: 'bg-fuchsia-400/14 dark:bg-fuchsia-400/18',
        badge:
          'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-700 dark:text-fuchsia-200',
        mediaFrame:
          'bg-fuchsia-400/12 dark:bg-fuchsia-400/16 border-fuchsia-300/20 dark:border-fuchsia-300/20',
      }
    case 'terminal':
      return {
        shell:
          'from-amber-500/22 via-orange-500/10 to-transparent dark:from-amber-500/18 dark:via-orange-500/8 dark:to-transparent',
        halo: 'bg-amber-400/14 dark:bg-amber-400/18',
        badge:
          'border-amber-400/30 bg-amber-400/10 text-amber-700 dark:text-amber-200',
        mediaFrame:
          'bg-amber-400/12 dark:bg-amber-400/16 border-amber-300/20 dark:border-amber-300/20',
      }
    default:
      return {
        shell:
          'from-slate-500/24 via-slate-400/10 to-transparent dark:from-slate-400/18 dark:via-slate-500/8 dark:to-transparent',
        halo: 'bg-slate-500/12 dark:bg-slate-500/18',
        badge: 'border-border bg-surface-muted text-foreground-muted',
        mediaFrame: 'bg-surface-strong/75 border-white/10',
      }
  }
}

export default function HomeHeroCarousel({ slides }: HomeHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDesktop, setIsDesktop] = useState(isDesktopViewport)
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>(
    'forward',
  )
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotionPreference,
  )
  const isChatAvailable = useChatAvailability()
  const { theme: siteTheme } = useTheme()
  const touchStartX = useRef<number | null>(null)

  const projectSlides: CarouselSlide[] = slides
    .filter(
      (
        slide,
      ): slide is Project & { homeHero: NonNullable<Project['homeHero']> } =>
        Boolean(slide.homeHero),
    )
    .map((slide) => ({
      ...slide,
      href: `/projects/${slide.slug}`,
    }))

  const desktopTerminalSlide: CarouselSlide = terminalHeroSlide
  const chatFeatureSlide: CarouselSlide = aiChatHeroSlide

  const carouselSlides: CarouselSlide[] = isDesktop
    ? [
        ...projectSlides,
        ...(isChatAvailable ? [chatFeatureSlide] : []),
        desktopTerminalSlide,
      ]
    : projectSlides.concat(isChatAvailable ? [chatFeatureSlide] : [])

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updatePreference()
    mediaQuery.addEventListener?.('change', updatePreference)
    mediaQuery.addListener?.(updatePreference)

    return () => {
      mediaQuery.removeEventListener?.('change', updatePreference)
      mediaQuery.removeListener?.(updatePreference)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const updateViewport = () => {
      setIsDesktop(isDesktopViewport())
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  useEffect(() => {
    if (activeIndex < carouselSlides.length) {
      return
    }

    setActiveIndex(0)
  }, [activeIndex, carouselSlides.length])

  useEffect(() => {
    if (carouselSlides.length < 2 || isPaused || prefersReducedMotion) {
      return
    }

    const nextIndex = (activeIndex + 1) % carouselSlides.length

    const timer = window.setTimeout(() => {
      setActiveIndex(nextIndex)
    }, 3600)

    return () => {
      window.clearTimeout(timer)
    }
  }, [activeIndex, carouselSlides.length, isPaused, prefersReducedMotion])

  const activeSlide = carouselSlides[activeIndex]
  const activeContent = activeSlide.homeHero

  if (!activeSlide || !activeContent) {
    return null
  }

  const theme = getSlideTheme(activeSlide.slug)
  const techPreview = activeSlide.technologies.slice(0, 3)
  const isContainedMedia = activeContent.media.fit === 'contain'
  const usesTerminalPreview = activeSlide.customMedia === 'terminal'
  const usesChatPreview = activeSlide.customMedia === 'chat'
  const usesHeaderLogoTreatment =
    activeContent.media.themeTreatment === 'header-logo' &&
    siteTheme === 'light'
  const usesCompactMobileLayout = !usesTerminalPreview
  const slideTransitionClass = prefersReducedMotion
    ? ''
    : slideDirection === 'forward'
      ? 'animate-carousel-slide-in-forward'
      : 'animate-carousel-slide-in-backward'
  const cardClasses =
    'group relative flex h-[31rem] overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[0_24px_80px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:-translate-y-1 md:h-[35rem]'

  const goToPrevious = () => {
    setSlideDirection('backward')
    setActiveIndex(
      (current) =>
        (current - 1 + carouselSlides.length) % carouselSlides.length,
    )
  }

  const goToNext = () => {
    setSlideDirection('forward')
    setActiveIndex((current) => (current + 1) % carouselSlides.length)
  }

  const goToIndex = (nextIndex: number) => {
    setSlideDirection(nextIndex < activeIndex ? 'backward' : 'forward')
    setActiveIndex(nextIndex)
  }

  return (
    <section
      aria-label="Featured project carousel"
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        const nextFocused = event.relatedTarget

        if (
          !(nextFocused instanceof Node) ||
          !event.currentTarget.contains(nextFocused)
        ) {
          setIsPaused(false)
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goToPrevious()
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goToNext()
        }

        if (event.key === 'Home') {
          event.preventDefault()
          goToIndex(0)
        }

        if (event.key === 'End') {
          event.preventDefault()
          goToIndex(carouselSlides.length - 1)
        }
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current
        const endX = event.changedTouches[0]?.clientX
        touchStartX.current = null

        if (startX === null || endX === undefined) {
          return
        }

        const delta = endX - startX

        if (Math.abs(delta) < 40) {
          return
        }

        if (delta > 0) {
          goToPrevious()
          return
        }

        goToNext()
      }}
    >
      <span className="sr-only" aria-live="polite">
        Showing slide {activeIndex + 1} of {carouselSlides.length}:{' '}
        {activeSlide.title}
      </span>

      {usesChatPreview ? (
        <button
          key={activeSlide.slug}
          type="button"
          onClick={() => openChatWidget()}
          className={`${cardClasses} ${slideTransitionClass}`}
          aria-label={`Open ${activeSlide.title}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme.shell}`}
            aria-hidden="true"
          />
          <div
            className={`absolute -right-12 -top-10 h-40 w-40 rounded-full blur-3xl ${theme.halo}`}
            aria-hidden="true"
          />

          <div className="relative flex h-full w-full flex-col">
            <div
              data-testid="carousel-media-panel"
              className={`${
                usesCompactMobileLayout
                  ? 'hidden h-[17rem] flex-1 overflow-hidden px-6 py-6 sm:flex md:h-[19rem] md:px-8 md:py-8'
                  : 'flex h-[17rem] flex-1 overflow-hidden px-6 py-6 md:h-[19rem] md:px-8 md:py-8'
              }`}
            >
              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] border shadow-[0_18px_45px_rgba(15,23,42,0.26)] ${theme.mediaFrame}`}
              >
                <div className="flex h-full w-full flex-col rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.22))] p-4 text-slate-900 dark:text-white md:p-5">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-700/80 dark:text-fuchsia-200/80">
                        {activeSlide.preview?.label}
                      </div>
                      <div className="mt-1 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        {activeSlide.preview?.title}
                      </div>
                    </div>
                    <div className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/12 px-2.5 py-1 text-[11px] font-medium text-fuchsia-700 dark:text-fuchsia-200">
                      {activeSlide.preview?.status}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col gap-3 text-left text-[13px] leading-5 md:text-sm md:leading-6">
                    <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-slate-950 px-4 py-2.5 text-white shadow-lg shadow-slate-950/15 dark:bg-slate-900">
                      {activeSlide.preview?.lines[0]}
                    </div>

                    <div className="max-w-[88%] rounded-2xl rounded-bl-md border border-white/20 bg-white/75 px-4 py-2.5 text-slate-700 shadow-lg shadow-slate-900/8 backdrop-blur-sm dark:bg-white/10 dark:text-slate-100">
                      {activeSlide.preview?.lines[1]}
                    </div>

                    <div className="max-w-[76%] rounded-2xl rounded-bl-md border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-slate-700 shadow-lg shadow-fuchsia-950/5 backdrop-blur-sm dark:bg-fuchsia-400/8 dark:text-slate-100">
                      {activeSlide.preview?.lines[2]}
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/15 bg-white/55 px-4 py-2.5 text-left text-[11px] leading-5 text-slate-600 backdrop-blur-sm dark:bg-white/8 dark:text-slate-200/80 md:text-xs">
                    {activeSlide.preview?.footer}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`relative z-10 flex flex-1 flex-col bg-gradient-to-t from-overlay/90 to-overlay/70 px-6 py-6 text-white md:px-8 md:py-7 ${
                usesCompactMobileLayout
                  ? 'sm:border-t sm:border-white/10'
                  : 'border-t border-white/10'
              }`}
            >
              <div
                className={`mb-3 inline-flex w-fit self-start rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${theme.badge}`}
              >
                {activeContent.eyebrow}
              </div>

              <h2 className="mb-3 text-left text-2xl font-bold leading-tight text-white md:text-3xl">
                {activeSlide.title}
              </h2>
              <p className="mb-5 max-w-xl text-left text-sm leading-6 text-slate-200 md:text-base">
                {activeContent.summary}
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {techPreview.map((tech) => {
                  const displayTech =
                    tech === 'SkyConnect Coordinator' ? 'IoT Automation' : tech

                  return (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-slate-100 backdrop-blur-sm"
                    >
                      <TechIcon tech={displayTech} className="h-5 w-5" />
                      <span>{displayTech}</span>
                    </span>
                  )
                })}
              </div>

              <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white">
                Open AI Assistant
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <Link
          key={activeSlide.slug}
          to={activeSlide.href}
          className={`${cardClasses} ${slideTransitionClass}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme.shell}`}
            aria-hidden="true"
          />
          <div
            className={`absolute -right-12 -top-10 h-40 w-40 rounded-full blur-3xl ${theme.halo}`}
            aria-hidden="true"
          />

          <div className="relative flex h-full w-full flex-col">
            <div
              data-testid="carousel-media-panel"
              className={`${
                usesCompactMobileLayout
                  ? 'hidden h-[17rem] flex-1 overflow-hidden px-6 py-6 sm:flex md:h-[19rem] md:px-8 md:py-8'
                  : 'flex h-[17rem] flex-1 overflow-hidden px-6 py-6 md:h-[19rem] md:px-8 md:py-8'
              }`}
            >
              <div
                className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] border shadow-[0_18px_45px_rgba(15,23,42,0.26)] ${theme.mediaFrame} ${
                  isContainedMedia && !usesTerminalPreview && !usesChatPreview
                    ? 'p-5 md:p-6'
                    : ''
                }`}
              >
                {usesTerminalPreview ? (
                  <div className="flex h-full w-full flex-col overflow-hidden rounded-[1.25rem] bg-terminal-bg font-mono shadow-inner shadow-black/35">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] text-terminal-green/85">
                      <span>terminal - pedroduartek</span>
                      <div className="flex gap-1.5" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-400/70" />
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/80" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-3 px-4 py-4 text-terminal-green md:px-5 md:py-5">
                      <div className="space-y-2 text-[12px] leading-5 md:text-[13px]">
                        <div>
                          <span className="text-terminal-accent">$</span> help
                        </div>
                        <div className="text-terminal-green/80">
                          about experience projects contact
                        </div>
                        <div>
                          <span className="text-terminal-accent">$</span> email
                        </div>
                        <div className="text-terminal-green/80">
                          Turnstile-verified message flow ready.
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#1b3a31] bg-black/25 px-3 py-3 text-[11px] text-terminal-accent md:text-xs">
                        keyboard-first shell for desktop visitors
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={activeContent.media.src}
                    alt={activeContent.media.alt}
                    className={`duration-500 group-hover:scale-[1.02] ${
                      usesHeaderLogoTreatment
                        ? 'transition-[filter,transform]'
                        : 'transition-transform'
                    } ${
                      isContainedMedia
                        ? 'h-full max-w-full object-contain'
                        : 'h-full w-full object-cover'
                    } ${usesHeaderLogoTreatment ? 'brightness-0' : ''}`}
                    style={
                      activeContent.media.objectPosition
                        ? { objectPosition: activeContent.media.objectPosition }
                        : undefined
                    }
                    loading="eager"
                    decoding="async"
                  />
                )}
              </div>
            </div>

            <div
              className={`relative z-10 flex flex-1 flex-col bg-gradient-to-t from-overlay/90 to-overlay/70 px-6 py-6 text-white md:px-8 md:py-7 ${
                usesCompactMobileLayout
                  ? 'sm:border-t sm:border-white/10'
                  : 'border-t border-white/10'
              }`}
            >
              <div
                className={`mb-3 inline-flex w-fit self-start rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${theme.badge}`}
              >
                {activeContent.eyebrow}
              </div>

              <h2 className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl">
                {activeSlide.title}
              </h2>
              <p className="mb-5 max-w-xl text-sm leading-6 text-slate-200 md:text-base">
                {activeContent.summary}
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {techPreview.map((tech) => {
                  const displayTech =
                    tech === 'SkyConnect Coordinator' ? 'IoT Automation' : tech

                  return (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-slate-100 backdrop-blur-sm"
                    >
                      <TechIcon tech={displayTech} className="h-5 w-5" />
                      <span>{displayTech}</span>
                    </span>
                  )
                })}
              </div>

              <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white">
                Go To Details Page
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {carouselSlides.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-2">
          {carouselSlides.map((slide, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={slide.slug}
                type="button"
                onClick={() => goToIndex(index)}
                aria-label={`Show slide ${index + 1}: ${slide.title}`}
                aria-pressed={isActive}
                className={`h-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'w-6 bg-foreground/80'
                    : 'w-2 bg-foreground-subtle/45 hover:bg-foreground-subtle/75'
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
