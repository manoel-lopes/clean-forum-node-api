import handlebars from 'handlebars'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { FastifyInstance } from 'fastify'
import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import type { EmailService } from '@/application/services/email-service'

export class FastifyEmailService implements EmailService {
  private template: ReturnType<typeof handlebars.compile> | null = null

  constructor (
    private readonly fastify: FastifyInstance,
    private readonly fromEmail: string
  ) {}

  async sendValidationCode (email: string, code: EmailValidationCode): Promise<void> {
    const template = await this.getTemplate()
    const html = template({
      email,
      code: code.value
    })

    await this.fastify.mailer.sendMail({
      to: email,
      subject: 'Verify your email address',
      html
    })
  }

  private async getTemplate (): Promise<ReturnType<typeof handlebars.compile>> {
    if (!this.template) {
      const templatePath = join(process.cwd(), 'src', 'infra', 'email', 'templates', 'email-validation.hbs')
      const templateContent = await readFile(templatePath, 'utf-8')
      this.template = handlebars.compile(templateContent)
    }
    return this.template
  }
}
