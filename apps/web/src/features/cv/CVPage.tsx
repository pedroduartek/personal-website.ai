import cvPdf from '../../CV/Pedro_Duarte_CV.pdf'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'

export default function CVPage() {
  return (
    <>
      <PageSEO title="Download CV" description="Download my CV as PDF" />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Curriculum Vitae
        </h1>

        <div className="max-w-4xl">
          <p className="mb-6 text-gray-300">
            Download my CV as a PDF for easy sharing and printing. The CV
            contains my complete professional experience, education, and skills.
          </p>

          <a
            href={cvPdf}
            download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/50"
          >
            Download CV (PDF)
          </a>

          {/* PDF Preview */}
          <div className="mt-8">
            <div className="rounded-lg border border-gray-700 bg-card p-4">
              <h2 className="mb-3 text-lg font-semibold text-white">Preview</h2>
              <div className="overflow-hidden rounded border border-gray-800">
                <iframe
                  src={`${cvPdf}#view=FitH`}
                  title="CV Preview"
                  className="h-[400px] w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
