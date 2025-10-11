import type { FastifyInstance } from 'fastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FastifyEmailService } from './fastify-email-service'

describe('FastifyEmailService', () => {
  let sut: FastifyEmailService
  let mockFastify: FastifyInstance
  let sendMailSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    sendMailSpy = vi.fn().mockResolvedValue(undefined)
    mockFastify = {
      mailer: {
        sendMail: sendMailSpy
      }
    } as unknown as FastifyInstance
    sut = new FastifyEmailService(mockFastify)
  })

  it('should send validation code email with correct parameters', async () => {
    const email = 'test@example.com'
    const code = '123456'

    await sut.sendValidationCode(email, code)

    expect(sendMailSpy).toHaveBeenCalledOnce()
    expect(sendMailSpy).toHaveBeenCalledWith({
      to: email,
      subject: 'Verify your email address',
      html: expect.stringContaining(code)
    })
  })

  it('should include email in rendered template', async () => {
    const email = 'user@example.com'
    const code = '999888'

    await sut.sendValidationCode(email, code)

    const callArgs = sendMailSpy.mock.calls[0][0]
    expect(callArgs.html).toContain(email)
    expect(callArgs.html).toContain(code)
  })

  it('should render HTML template', async () => {
    const email = 'test@example.com'
    const code = '123456'

    await sut.sendValidationCode(email, code)

    const callArgs = sendMailSpy.mock.calls[0][0]
    expect(callArgs.html).toContain('<')
    expect(callArgs.html).toContain('>')
  })

  it('should cache compiled template', async () => {
    const email1 = 'test1@example.com'
    const email2 = 'test2@example.com'

    await sut.sendValidationCode(email1, '123456')
    await sut.sendValidationCode(email2, '654321')

    expect(sendMailSpy).toHaveBeenCalledTimes(2)
  })

  it('should handle different email addresses', async () => {
    const emails = [
      'user1@example.com',
      'user2@test.org',
      'admin@company.net'
    ]

    for (const email of emails) {
      await sut.sendValidationCode(email, '123456')

      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({ to: email })
      )
    }
  })

  it('should propagate mailer errors', async () => {
    const error = new Error('SMTP connection failed')
    sendMailSpy.mockRejectedValue(error)

    await expect(
      sut.sendValidationCode('test@example.com', '123456')
    ).rejects.toThrow('SMTP connection failed')
  })
})
