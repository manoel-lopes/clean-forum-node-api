import { env } from '@/lib/env'

type MailHogMessage = {
  ID: string
  From: {
    Relays: null
    Mailbox: string
    Domain: string
    Params: string
  }
  To: Array<{
    Relays: null
    Mailbox: string
    Domain: string
    Params: string
  }>
  Content: {
    Headers: Record<string, string[]>
    Body: string
    Size: number
    MIME: null
  }
  Created: string
  MIME: null
  Raw: {
    From: string
    To: string[]
    Data: string
    Helo: string
  }
}

type MailHogResponse = {
  total: number
  count: number
  start: number
  items: MailHogMessage[]
}

/**
 * Fetches the latest email sent to a specific email address from MailHog
 * Only works in test environment when SMTP_HOST is configured
 */
export async function getLatestEmailForAddress (email: string): Promise<MailHogMessage | null> {
  if (env.NODE_ENV !== 'test' || !env.SMTP_HOST) {
    throw new Error('Email fetching is only available in test environment with MailHog configured')
  }
  const mailHogApiUrl = 'http://localhost:8025/api/v2/messages'

  try {
    const response = await fetch(mailHogApiUrl)
    if (!response.ok) {
      throw new Error(`MailHog API error: ${response.status}`)
    }
    const data = await response.json() as MailHogResponse
    // Find the latest email sent to the specified address
    const targetEmail = email.toLowerCase()
    const latestEmail = data.items
      .filter(message =>
        message.To.some(recipient =>
          recipient.Mailbox.toLowerCase() + '@' + recipient.Domain.toLowerCase() === targetEmail
        )
      )
      .sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime())[0]

    return latestEmail || null
  } catch (error) {
    console.error('Failed to fetch email from MailHog:', error)
    return null
  }
}

/**
 * Extracts validation code from email content
 * Looks for 6-digit codes in the email body
 */
export function extractValidationCodeFromEmail (emailContent: string): string | null {
  // Look for 6-digit validation codes in the email content
  const codeMatch = emailContent.match(/\b\d{6}\b/)
  return codeMatch ? codeMatch[0] : null
}

/**
 * Gets the validation code sent to a specific email address
 * Combines fetching the latest email and extracting the code
 */
export async function getValidationCodeForEmail (email: string): Promise<string | null> {
  const latestEmail = await getLatestEmailForAddress(email)
  if (!latestEmail) {
    return null
  }
  return extractValidationCodeFromEmail(latestEmail.Content.Body)
}

/**
 * Waits for an email to be sent to the specified address and returns the validation code
 * Useful for e2e tests that need to wait for email delivery
 */
export async function waitForValidationCode (
  email: string,
  timeoutMs: number = 10000,
  intervalMs: number = 500
): Promise<string | null> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const code = await getValidationCodeForEmail(email)
    if (code) {
      return code
    }
    // Wait before trying again
    await new Promise(resolve => setTimeout(resolve, intervalMs))
  }

  return null
}

/**
 * Clears all emails from MailHog
 * Useful for cleaning up between tests
 */
export async function clearAllEmails (): Promise<void> {
  if (env.NODE_ENV !== 'test' || !env.SMTP_HOST) {
    throw new Error('Email clearing is only available in test environment with MailHog configured')
  }
  const mailHogApiUrl = 'http://localhost:8025/api/v1/messages'

  try {
    const response = await fetch(mailHogApiUrl, { method: 'DELETE' })
    if (!response.ok) {
      throw new Error(`MailHog API error: ${response.status}`)
    }
  } catch (error) {
    console.error('Failed to clear emails from MailHog:', error)
    throw error
  }
}
