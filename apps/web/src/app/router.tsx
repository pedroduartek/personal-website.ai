import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'

const Home = lazy(() => import('../features/home/HomePage'))
const About = lazy(() => import('../features/about/AboutPage'))
const Experience = lazy(() => import('../features/experience/ExperiencePage'))
const Projects = lazy(() => import('../features/projects/ProjectsPage'))
const ProjectDetail = lazy(
  () => import('../features/projects/ProjectDetailPage'),
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
      { path: 'projects', element: <Projects /> },
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
