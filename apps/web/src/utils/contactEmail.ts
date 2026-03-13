export const CONTACT_EMAIL_ENDPOINT = 'https://api.pedroduartek.com/email'

export type ContactEmailValues = {
  name: string
  email: string
  subject: string
  message: string
}

type ContactEmailSource = 'contact form' | 'terminal'

function normalizeValues(values: ContactEmailValues): ContactEmailValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  }
}

export function buildContactEmailBody(
  values: ContactEmailValues,
  source: ContactEmailSource,
) {
  const normalizedValues = normalizeValues(values)

  return [
    `<p>New message from pedroduartek.com ${source}</p>`,
    `<p><strong>Name:</strong> ${normalizedValues.name}<br/><strong>Email:</strong> ${normalizedValues.email}</p>`,
    `<p><strong>Subject:</strong> ${normalizedValues.subject}</p>`,
    '<p><strong>Message:</strong></p>',
    `<p>${normalizedValues.message.replace(/\n/g, '<br/>')}</p>`,
  ].join('\n')
}

export async function sendContactEmail(
  values: ContactEmailValues,
  source: ContactEmailSource,
) {
  const normalizedValues = normalizeValues(values)

  const response = await fetch(CONTACT_EMAIL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: normalizedValues.subject,
      body: buildContactEmailBody(normalizedValues, source),
      isHtml: true,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail || 'Unable to send your message right now.')
  }
}
