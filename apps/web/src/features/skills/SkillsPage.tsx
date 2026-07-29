import PageSEO from '../../components/seo/PageSEO'
import { skills } from '../../content/skills'
import {
  calculateMonthsFromDate,
  calculateYearsFromDate,
} from '../../utils/experience'

// Ordinal seniority ramp: every level gets its own colour, ordered as a
// warm->cool spectrum (recent = warm, veteran = cool). The exact value is also
// printed as text, so colour only reinforces it. Text colours are chosen for
// contrast on each badge (dark ink on the light amber, white on the rest).
function getYearsBadgeColor(years: number): string {
  if (years >= 6) return 'bg-blue-600 text-white'
  if (years === 5) return 'bg-teal-600 text-white'
  if (years === 4) return 'bg-green-600 text-white'
  if (years === 3) return 'bg-lime-600 text-white'
  if (years === 2) return 'bg-amber-500 text-amber-950'
  if (years === 1) return 'bg-orange-600 text-white'
  return 'bg-slate-500 text-white' // < 1 year (shown in months)
}

export default function SkillsPage() {
  return (
    <>
      <PageSEO
        title="Skills"
        description="Technical skills and expertise across various technologies"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/skills'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
          Skills
        </h1>
        <div className="mb-10 max-w-3xl">
          <p className="text-base text-foreground-muted md:text-lg">
            A practical view of the technologies I use most, along with the
            areas where I have taken on broader ownership or leadership.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {skills.map((group) => (
            <section key={group.category} className="theme-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground md:text-2xl">
                {group.category}
              </h2>
              <div className="space-y-3">
                {[...group.skills]
                  .sort((a, b) => a.startDate.localeCompare(b.startDate))
                  .map((skill) => {
                    const years = calculateYearsFromDate(skill.startDate)
                    let experienceText: string
                    if (years >= 1) {
                      experienceText = years === 1 ? '1 year' : `${years} years`
                    } else {
                      const months = Math.max(
                        1,
                        calculateMonthsFromDate(skill.startDate),
                      )
                      experienceText =
                        months === 1 ? '1 month' : `${months} months`
                    }

                    return (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-foreground">{skill.name}</span>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${getYearsBadgeColor(years)}`}
                        >
                          {experienceText}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
