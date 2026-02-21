import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import cvPdf from '../../CV/Pedro_Duarte_CV.pdf'

export default function CVPage() {
  return (
    <>
      <PageSEO title="Download CV" description="Download my CV as PDF" />
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <h1 className="mb-8 text-4xl font-bold text-white">Download CV</h1>
        <div className="max-w-2xl">
          <p className="mb-6 text-lg text-gray-300">
            Download my CV as a PDF for easy sharing and printing. The CV
            contains my complete professional experience, education, and skills.
          </p>
          <a
            href={cvPdf}
            download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Download CV (PDF)
          </a>
        </div>
      </div>
    </>
  )
}
