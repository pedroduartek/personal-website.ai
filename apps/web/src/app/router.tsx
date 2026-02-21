import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'

const Home = lazy(() => import('../features/home/HomePage'))
const About = lazy(() => import('../features/about/AboutPage'))
const Experience = lazy(() => import('../features/experience/ExperiencePage'))
const ExperienceDetail = lazy(
  () => import('../features/experience/ExperienceDetailPage'),
)
const Projects = lazy(() => import('../features/projects/ProjectsPage'))
const ProjectDetail = lazy(
  () => import('../features/projects/ProjectDetailPage'),
)
const HomeAssistantProject = lazy(
  () => import('../features/projects/HomeAssistantProjectPage'),
)
const PersonalWebsiteProject = lazy(
  () => import('../features/projects/PersonalWebsiteProjectPage'),
)
const Education = lazy(() => import('../features/education/EducationPage'))
const Conferences = lazy(
  () => import('../features/conferences/ConferencesPage'),
)
const Skills = lazy(() => import('../features/skills/SkillsPage'))
const Blog = lazy(() => import('../features/blog/BlogPage'))
const BlogPost = lazy(() => import('../features/blog/BlogPostPage'))
const Contact = lazy(() => import('../features/contact/ContactPage'))
const CV = lazy(() => import('../features/cv/CVPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'experience', element: <Experience /> },
      { path: 'experience/:id', element: <ExperienceDetail /> },
      { path: 'projects', element: <Projects /> },
      {
        path: 'projects/personal-website',
        element: <PersonalWebsiteProject />,
      },
      { path: 'projects/home-assistant', element: <HomeAssistantProject /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'education', element: <Education /> },
      { path: 'conferences', element: <Conferences /> },
      { path: 'skills', element: <Skills /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'contact', element: <Contact /> },
      { path: 'cv', element: <CV /> },
    ],
  },
])
