import { Link } from 'react-router-dom'
import StyledLink from '../../components/StyledLink'
import TechIcon from '../../components/TechIcon'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { getExperience } from '../../utils/experience'

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)
  const experience = getExperience()

  return (
    <>
      <PageSEO
        title="Home"
        description={`${profile.name} - ${profile.role}. ${profile.bio}`}
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com'
        }
      />
      <div className="container mx-auto px-4 py-8 lg:py-16 animate-slide-down">
        <section className="mb-12 lg:mb-16">
          <h1 className="mb-4 text-3xl font-bold text-foreground lg:text-5xl">
            {profile.name}
          </h1>
          <p className="mb-4 text-xl text-foreground-muted lg:text-2xl">
            {profile.role}
          </p>
          <div className="mb-8 max-w-4xl">
            <p className="mb-4 text-base text-foreground-muted lg:text-lg">
              Welcome. I&apos;m a backend software engineer with{' '}
              {experience.text} of experience in C#/.NET, microservices, and
              event-driven systems.{' '}
              <StyledLink href="/about">Learn more about me</StyledLink>
            </p>
            <p className="mb-4 text-base text-foreground-muted lg:text-lg">
              This website is also a learning project. Frontend development was
              not the center of my background, so I used this portfolio as a
              practical way to learn React, TypeScript, and modern UI work by
              building something real.{' '}
              <StyledLink href="/projects">
                See the full project details
              </StyledLink>
            </p>
            <p className="mb-4 text-base text-foreground-muted lg:text-lg">
              It is also an experiment in using AI thoughtfully in software
              development: accelerating learning and iteration without giving up
              judgment, ownership, or quality.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/experience"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/50"
            >
              Professional Experience
            </Link>
            <Link to="/projects" className="theme-button-secondary-prominent">
              Personal Projects
            </Link>
            <Link to="/contact" className="theme-button-secondary-prominent">
              Contact Me
            </Link>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
            Featured Personal Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="theme-card-hover group flex flex-col p-6"
              >
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="mb-4 text-foreground-subtle">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 3).map((tech) => {
                    const displayTech =
                      tech === 'SkyConnect Coordinator'
                        ? 'IoT Automation'
                        : tech
                    return (
                      <span key={tech} className="theme-chip">
                        <span className="flex-shrink-0">
                          <TechIcon tech={displayTech} className="w-6 h-6" />
                        </span>
                        <span className="leading-none">{displayTech}</span>
                      </span>
                    )
                  })}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
