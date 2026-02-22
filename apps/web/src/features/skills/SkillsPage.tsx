import PageSEO from '../../components/seo/PageSEO'
import { skills } from '../../content/skills'

function getYearsBadgeColor(years: string): string {
  const yearNum = parseInt(years)
  if (yearNum >= 6) return 'bg-blue-600 text-white'
  if (yearNum === 5) return 'bg-teal-600 text-white'
  if (yearNum === 4) return 'bg-green-600 text-white'
  if (yearNum === 3) return 'bg-lime-600 text-white'
  return 'bg-gray-600 text-gray-200'
}

export default function SkillsPage() {
  return (
    <>
      <PageSEO
        title="Skills"
        description="Technical skills and expertise across various technologies"
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Skills
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {skills.map((group) => (
            <section
              key={group.category}
              className="rounded-lg border border-gray-700 bg-card p-6"
            >
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white">{skill.name}</span>
                    {skill.years && (
                      <span className={`rounded px-2 py-1 text-xs font-medium ${getYearsBadgeColor(skill.years)}`}>
                        {skill.years}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
