import { Link } from 'react-router-dom'
import TechIcon from '../../components/TechIcon'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function ProjectsPage() {
  return (
    <>
      <PageSEO
        title="Projects"
        description="Portfolio of software projects and side projects"
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/projects'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
          Projects
        </h1>
        <div className="mb-10 max-w-3xl">
          <p className="text-base text-foreground-muted md:text-lg">
            A selection of projects that reflect how I learn, what I enjoy
            building, and the kinds of systems I like to own end to end.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="theme-card-hover group block h-full p-6"
            >
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-bold text-foreground md:text-2xl">
                  {project.title}
                </h2>
                <p className="mb-3 text-foreground-subtle">
                  {project.description}
                </p>
                <div className="mb-4 flex items-center gap-4 text-sm text-foreground-subtle">
                  <time>
                    {new Date(project.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                    {project.endDate
                      ? ` - ${new Date(project.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                      : ' - Present'}
                  </time>
                  {project.links?.github && (
                    <>
                      <span>•</span>
                      <span>Open Source</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="theme-chip">
                      <span className="flex-shrink-0">
                        <TechIcon tech={tech} className="w-5 h-5" />
                      </span>
                      <span className="leading-normal">{tech}</span>
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
