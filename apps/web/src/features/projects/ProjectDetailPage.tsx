import { Link, useParams } from 'react-router-dom'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="text-xl font-bold text-white md:text-2xl">
          Project not found
        </h1>
        <Link
          to="/projects"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
        >
          <span>←</span> Back to projects
        </Link>
      </div>
    )
  }

  return (
    <>
      <PageSEO
        title={project.title}
        description={project.description}
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : `https://www.pedroduartek.com/projects/${project.slug}`
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {project.title}
        </h1>

        <p className="mb-6 text-lg text-gray-300 md:text-xl">
          {project.description}
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-gray-700 bg-card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">
              The Problem
            </h2>
            <p className="text-gray-300">{project.problem}</p>
          </section>

          <section className="rounded-lg border border-gray-700 bg-card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">
              The Approach
            </h2>
            <p className="text-gray-300">{project.approach}</p>
          </section>
        </div>

        {project.links && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/50"
              >
                View Demo
              </a>
            )}
            {project.links.github && (
              <StyledLink
                href={project.links.github}
                target="_blank"
                bigger
                className="inline-flex items-center gap-2 rounded-lg border border-brand-700 bg-brand px-4 py-2 text-center text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
                ariaLabel="View repository on GitHub"
              >
                <span className="font-mono mr-2">&lt;&gt;</span>
                View on GitHub
              </StyledLink>
            )}
          </div>
        )}

        <div className="text-sm text-gray-400">
          <time>
            {new Date(project.startDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })}
          </time>
          {project.endDate && (
            <>
              {' '}
              -{' '}
              <time>
                {new Date(project.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </>
  )
}
