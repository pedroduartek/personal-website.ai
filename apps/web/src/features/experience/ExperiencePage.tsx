import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { experience } from '../../content/experience'
import closerLogo from '../../images/closer_consulting.png'
import enhesaLogo from '../../images/enhesa.png'
import vortalLogo from '../../images/vortal.png'

const companyLogos: Record<string, string> = {
  Enhesa: enhesaLogo,
  VORTAL: vortalLogo,
  'Closer Consulting': closerLogo,
}

const createCompanySlug = (company: string) =>
  company.toLowerCase().replace(/\s+/g, '-')

export default function ExperiencePage() {
  // Group experiences by company
  const groupedExperiences = experience.reduce(
    (acc, item) => {
      if (!acc[item.company]) {
        acc[item.company] = []
      }
      acc[item.company].push(item)
      return acc
    },
    {} as Record<string, typeof experience>,
  )

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const roleRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [dotPositions, setDotPositions] = useState<Record<string, number>>({})
  const [leftWidth, setLeftWidth] = useState<number>(0)

  const flattenedRoles = useMemo(
    () =>
      experience.map((r) => ({
        company: r.company,
        role: r,
        key: `${r.company}-${r.id}`,
      })),
    [],
  )

  // Get unique technologies for each company, keeping most specific versions
  const getCompanyTechnologies = (roles: typeof experience) => {
    const techsWithIndex = roles.flatMap((role, index) =>
      role.technologies.map((tech) => ({ tech, index })),
    )

    const uniqueTechs = new Map<string, string>()

    for (const { tech, index } of techsWithIndex) {
      const normalized = tech.toLowerCase()
      let foundSimilar = false
      for (const [key, value] of uniqueTechs.entries()) {
        const existingNormalized = value.toLowerCase()
        if (
          normalized.includes(existingNormalized) ||
          existingNormalized.includes(normalized)
        ) {
          if (
            tech.length > value.length ||
            (tech.length === value.length &&
              index < Number.parseInt(key.split('-')[1]))
          ) {
            uniqueTechs.delete(key)
            uniqueTechs.set(`${tech}-${index}`, tech)
          }
          foundSimilar = true
          break
        }
      }
      if (!foundSimilar) {
        uniqueTechs.set(`${tech}-${index}`, tech)
      }
    }

    return Array.from(uniqueTechs.values())
  }

  useLayoutEffect(() => {
    function measure() {
      const wrapperRect = wrapperRef.current?.getBoundingClientRect()
      const leftRect = leftRef.current?.getBoundingClientRect()
      if (!wrapperRect) return
      setLeftWidth(leftRect?.width ?? 0)
      const newPositions: Record<string, number> = {}
      for (const fr of flattenedRoles) {
        const el = roleRefs.current[fr.key]
        if (!el) continue
        const r = el.getBoundingClientRect()
        const center = r.top + r.height / 2 - wrapperRect.top
        newPositions[fr.key] = Math.round(center)
      }
      setDotPositions((prev) => {
        const keys = Object.keys(newPositions)
        let changed = false
        if (Object.keys(prev).length !== keys.length) changed = true
        if (!changed) {
          for (const k of keys) {
            if (prev[k] !== newPositions[k]) {
              changed = true
              break
            }
          }
        }
        if (!changed) return prev
        return newPositions
      })
    }

    const rafId = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measure)
    }
  }, [flattenedRoles])

  return (
    <>
      <PageSEO
        title="Experience"
        description="Professional experience and work history"
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/experience'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Experience
        </h1>
        <div ref={wrapperRef} className="relative flex w-full">
          <div
            ref={leftRef}
            className="relative w-12 md:w-16 flex flex-col items-center"
          >
            <div className="h-full w-full" />
          </div>

          <div
            aria-hidden
            className="absolute top-0 left-0 pointer-events-none h-full"
            style={{ width: leftWidth }}
          >
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-b from-blue-500/80 to-blue-900/40 rounded-full"
              style={{
                left: Math.max(0, Math.round(leftWidth / 2) - 1),
                width: 2,
              }}
            />
            <span
              aria-hidden
              style={{ left: Math.max(0, Math.round(leftWidth / 2)) }}
              className="absolute inline-flex items-center justify-center px-3 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm ring-1 ring-blue-900/40 z-20 recording -top-3 -translate-x-1/2"
            >
              Now
            </span>
            {flattenedRoles.map((fr) => {
              const top = dotPositions[fr.key]
              if (typeof top !== 'number') return null
              return (
                <span
                  key={fr.key}
                  style={{
                    position: 'absolute',
                    top: top - 8,
                    left: Math.max(0, Math.round(leftWidth / 2) - 8),
                  }}
                  className="block h-4 w-4 rounded-full border-2 border-blue-400 bg-blue-700 shadow-md z-10"
                />
              )
            })}
          </div>

          <div className="flex-1 flex flex-col pl-2.5">
            {Object.entries(groupedExperiences).map(([company, roles]) => {
              const companyTechnologies = getCompanyTechnologies(roles)
              return (
                <div key={company} className="mb-8">
                  <Link
                    to={`/experience/${createCompanySlug(company)}`}
                    className="block rounded-lg border border-gray-700 bg-card p-6 pl-4 md:pl-8 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-lg"
                  >
                    <div className="mb-6 flex items-center gap-4">
                      {companyLogos[company] && (
                        <img
                          src={companyLogos[company]}
                          alt={`${company} logo`}
                          className="h-12 w-12 rounded object-contain"
                        />
                      )}
                      <h2 className="text-xl font-bold text-white md:text-2xl">
                        {company}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {companyTechnologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-8">
                      {roles.map((item) => {
                        const key = `${company}-${item.id}`
                        return (
                          <div
                            key={item.id}
                            ref={(el) => {
                              roleRefs.current[key] = el
                            }}
                            className="rounded-lg border border-gray-600 bg-gray-800/50 p-4"
                          >
                            <h3 className="text-lg font-bold text-white md:text-xl">
                              {item.title}
                            </h3>
                            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                              <time>
                                {new Date(item.startDate).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                  },
                                )}{' '}
                                -{' '}
                                {item.endDate
                                  ? new Date(item.endDate).toLocaleDateString(
                                      'en-US',
                                      {
                                        year: 'numeric',
                                        month: 'short',
                                      },
                                    )
                                  : 'Present'}
                              </time>
                              <span>•</span>
                              <span>{item.location}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
