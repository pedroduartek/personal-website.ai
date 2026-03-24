import { Link } from 'react-router-dom'
import HomeHeroCarousel from '../../components/HomeHeroCarousel'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'
import { experience as experienceItems } from '../../content/experience'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import { getExperience } from '../../utils/experience'

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured)
  const experience = getExperience()
  const currentCompany = experienceItems[0]?.company

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
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:gap-12">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-foreground lg:text-6xl">
                {profile.name}
              </h1>
              <p className="mb-4 text-xl text-foreground-muted lg:text-2xl">
                {profile.role}
                {currentCompany ? (
                  <>
                    <Link
                      to="/experience"
                      className="ml-3 inline-flex items-baseline gap-2 text-inherit no-underline transition-colors duration-200 hover:text-foreground"
                    >
                      <span>@</span>
                      <span className="live-text-pulse inline-block">
                        {currentCompany}
                      </span>
                    </Link>
                  </>
                ) : null}
              </p>
              <div className="mb-4 max-w-4xl lg:mb-5">
                <p className="mb-4 text-base text-foreground-muted lg:text-lg">
                  Welcome. I&apos;m a backend software engineer with{' '}
                  {experience.text} of experience in C#/.NET, microservices, and
                  event-driven systems.{' '}
                  <StyledLink href="/about" variant="inline-underline">
                    Learn more about me
                  </StyledLink>
                </p>
                <p className="mb-4 text-base text-foreground-muted lg:text-lg">
                  This website is also a learning project. Frontend development
                  was not the center of my background, so I used this portfolio
                  as a practical way to learn React, TypeScript, and modern UI
                  work by building something real.{' '}
                  <StyledLink href="/projects" variant="inline-underline">
                    See the full project details
                  </StyledLink>
                </p>
                <p className="text-base text-foreground-muted lg:text-lg">
                  It is also an experiment in using AI thoughtfully in software
                  development: accelerating learning and iteration without
                  giving up judgment, ownership, or quality.
                </p>
              </div>
            </div>

            <HomeHeroCarousel slides={featuredProjects} />
          </div>
        </section>
      </div>
    </>
  )
}
