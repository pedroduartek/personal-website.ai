import { postJson, readApiError } from './apiClient'

export const CONTACT_EMAIL_ENDPOINT = 'https://api.pedroduartek.com/email'

export type ContactEmailValues = {
  name: string
  email: string
  subject: string
  message: string
  company?: string
}

type ContactEmailSource = 'contact form' | 'terminal'

function normalizeValues(values: ContactEmailValues): ContactEmailValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
    company: values.company?.trim() ?? '',
  }
}

function assertContactEmailValues(values: ContactEmailValues) {
  if (values.company) {
    throw new Error('Unable to send your message right now.')
  }

  if (values.name.length < 2 || values.name.length > 100) {
    throw new Error('Please enter a name between 2 and 100 characters.')
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    throw new Error('Please enter a valid email address.')
  }

  if (values.subject.length < 3 || values.subject.length > 160) {
    throw new Error('Please enter a subject between 3 and 160 characters.')
  }

  if (values.message.length < 10 || values.message.length > 4000) {
    throw new Error('Please enter a message between 10 and 4000 characters.')
  }
}

export async function sendContactEmail(
  values: ContactEmailValues,
  source: ContactEmailSource,
  turnstileToken: string,
) {
  const normalizedValues = normalizeValues(values)
  assertContactEmailValues(normalizedValues)

  if (!turnstileToken.trim()) {
    throw new Error('Complete the spam check before sending your message.')
  }

  const response = await postJson(
    CONTACT_EMAIL_ENDPOINT,
    {
      name: normalizedValues.name,
      email: normalizedValues.email,
      subject: normalizedValues.subject,
      message: normalizedValues.message,
      source,
      turnstileToken,
      company: normalizedValues.company ?? '',
    },
    1,
  )

  if (!response.ok) {
    const detail = await readApiError(
      response,
      response.status === 429
        ? 'Too many messages were sent from your connection. Please try again later.'
        : 'Unable to send your message right now.',
    )
    throw new Error(detail)
  }
}
