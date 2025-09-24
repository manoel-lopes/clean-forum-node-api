import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import handlebars, { type TemplateDelegate } from 'handlebars'
import type { FastifyInstance } from 'fastify'
import type { EmailService } from '@/application/services/email-service'
import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'

export class FastifyEmailService implements EmailService {
  private template: TemplateDelegate

  constructor (
    private readonly fastify: FastifyInstance
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

  private async getTemplate (): Promise<TemplateDelegate> {
    if (!this.template) {
      const templatePath = this.getPath()
      const templateContent = await readFile(templatePath, 'utf-8')
      this.template = handlebars.compile(templateContent)
    }
    return this.template
  }

  private getPath (): string {
    const paths = ['src', 'infra', 'email', 'templates', 'email-validation.hbs']
    return join(process.cwd(), ...paths)
  }
}
