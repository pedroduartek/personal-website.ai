import cvPdf from '../../CV/Pedro_Duarte_CV.pdf'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'

export default function CVPage() {
  return (
    <>
      <PageSEO
        title="Download CV"
        description="Download my CV as PDF"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/cv'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
          CV
        </h1>

        <div className="max-w-4xl">
          <p className="mb-6 text-foreground-muted">
            Download a PDF version of my CV if you want a portable summary of my
            experience, education, and skills.
          </p>

          <a
            href={cvPdf}
            download={`${profile.name.replace(/\s+/g, '_')}_CV.pdf`}
            className="theme-button-primary"
          >
            Download CV (PDF)
          </a>

          {/* PDF Preview */}
          <div className="mt-8">
            <div className="theme-card p-4">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Preview
              </h2>
              <div className="overflow-hidden rounded border border-border">
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
