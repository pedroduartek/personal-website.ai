import PageSEO from '../../components/seo/PageSEO'
import { skills } from '../../content/skills'

export default function SkillsPage() {
  const getLevelColor = (
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  ) => {
    const colors = {
      beginner: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      intermediate:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      advanced:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      expert:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    }
    return colors[level]
  }

  return (
    <>
      <PageSEO
        title="Skills"
        description="Technical skills and expertise across various technologies"
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">Skills</h1>
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
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${getLevelColor(skill.level)}`}
                    >
                      {skill.level}
                    </span>
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
