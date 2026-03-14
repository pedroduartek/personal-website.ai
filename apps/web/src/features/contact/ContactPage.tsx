import { type FormEvent, useState } from 'react'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import {
  type ContactEmailValues,
  sendContactEmail,
} from '../../utils/contactEmail'

const initialFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
}

type ContactFormValues = ContactEmailValues
type SubmitState = 'idle' | 'success' | 'error'

export default function ContactPage() {
  const [formValues, setFormValues] =
    useState<ContactFormValues>(initialFormValues)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMessageForm, setShowMessageForm] = useState(false)

  function updateField<K extends keyof ContactFormValues>(
    field: K,
    value: ContactFormValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))
    if (submitState !== 'idle') {
      setSubmitState('idle')
      setStatusMessage('')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedValues = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      subject: formValues.subject.trim(),
      message: formValues.message.trim(),
      company: (formValues.company ?? '').trim(),
    }

    if (
      !trimmedValues.name ||
      !trimmedValues.email ||
      !trimmedValues.subject ||
      !trimmedValues.message
    ) {
      setSubmitState('error')
      setStatusMessage('Please fill in all fields before sending.')
      return
    }

    setIsSubmitting(true)
    setSubmitState('idle')
    setStatusMessage('')

    try {
      await sendContactEmail(trimmedValues, 'contact form')

      setFormValues(initialFormValues)
      setSubmitState('success')
      setStatusMessage(
        'Your message has been sent. I will get back to you as soon as I can.',
      )
    } catch (error) {
      setSubmitState('error')
      setStatusMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Unable to send your message right now. Please use the email link below instead.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusClasses =
    submitState === 'success'
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
      : 'border-red-500/40 bg-red-500/10 text-red-200'

  return (
    <>
      <PageSEO
        title="Contact"
        description="Get in touch with me"
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/contact'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <div className="max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
            Contact
          </h1>
          <p className="text-base text-gray-300 md:text-lg">
            I&apos;m always open to relevant opportunities, thoughtful
            conversations, and meeting other engineers. If you want to reach me,
            use the message form or any of the direct contact options.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.9fr)]">
          <section className="self-start rounded-lg border border-gray-700 bg-card p-6 md:p-8">
            <button
              type="button"
              aria-expanded={showMessageForm}
              aria-controls="contact-message-form"
              onClick={() => setShowMessageForm((current) => !current)}
              className="flex w-full items-start justify-between gap-4 text-left"
            >
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  This sends a message directly to my inbox at{' '}
                  {profile.email}.
                </p>
              </div>
              <span className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
                {showMessageForm ? 'Hide form' : 'Open form'}
              </span>
            </button>

            {showMessageForm && (
              <form
                id="contact-message-form"
                className="mt-6 space-y-5 border-t border-gray-700 pt-6"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-200">
                      Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={formValues.name}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-700/50"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-200">
                      Email
                    </span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={formValues.email}
                      onChange={(event) =>
                        updateField('email', event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-700/50"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-200">
                    Subject
                  </span>
                  <input
                    type="text"
                    name="subject"
                    required
                    maxLength={160}
                    value={formValues.subject}
                    onChange={(event) =>
                      updateField('subject', event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-700/50"
                  />
                </label>

                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formValues.company ?? ''}
                  onChange={(event) => updateField('company', event.target.value)}
                  className="hidden"
                />

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-200">
                    Message
                  </span>
                  <textarea
                    name="message"
                    required
                    rows={8}
                    maxLength={4000}
                    value={formValues.message}
                    onChange={(event) =>
                      updateField('message', event.target.value)
                    }
                    className="min-h-48 w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-700/50"
                  />
                </label>

                {submitState !== 'idle' && statusMessage && (
                  <div
                    role={submitState === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                    className={`rounded-lg border px-4 py-3 text-sm ${statusClasses}`}
                  >
                    {statusMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-500">
                    Include enough detail for context. Your own email address is
                    included in the message body so I can reply directly.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending...' : 'Send email'}
                  </button>
                </div>
              </form>
            )}
          </section>

          <div className="space-y-6">
            <div className="group rounded-lg border border-gray-700 bg-card p-6 transition-colors hover:border-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800">
                  <svg
                    className="h-6 w-6 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Email Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="mb-1 text-xl font-semibold text-white">
                    Email
                  </h2>
                  <StyledLink
                    href={`mailto:${profile.email}`}
                    ariaLabel="Send email"
                  >
                    {profile.email}
                  </StyledLink>
                </div>
              </div>
            </div>

            <div className="group rounded-lg border border-gray-700 bg-card p-6 transition-colors hover:border-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-linkedin">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>LinkedIn Icon</title>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="mb-1 text-xl font-semibold text-white">
                    LinkedIn
                  </h2>
                  <StyledLink
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    ariaLabel="Open LinkedIn profile"
                  >
                    {profile.linkedinHandle}
                  </StyledLink>
                </div>
              </div>
            </div>

            {profile.github && (
              <div className="group rounded-lg border border-gray-700 bg-card p-6 transition-colors hover:border-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>GitHub Icon</title>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-1 text-xl font-semibold text-white">
                      GitHub
                    </h2>
                    <StyledLink
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      ariaLabel="Open GitHub profile"
                    >
                      {profile.githubHandle ?? profile.github}
                    </StyledLink>
                  </div>
                </div>
              </div>
            )}

            {profile.twitter && (
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h2 className="mb-2 text-xl font-semibold text-white">
                  Twitter
                </h2>
                <StyledLink
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Open Twitter profile"
                >
                  Follow on Twitter
                </StyledLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
