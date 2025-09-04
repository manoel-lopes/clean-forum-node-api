import handlebars from 'handlebars'
import type { Transporter } from 'nodemailer'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import type { EmailService } from '@/application/services/email-service'

export class NodemailerEmailService implements EmailService {
  private template: ReturnType<typeof handlebars.compile> | null = null

  constructor (
    private readonly transporter: Transporter,
    private readonly fromEmail: string
  ) {}

  async sendValidationCode (email: string, code: EmailValidationCode): Promise<void> {
    const template = await this.getTemplate()
    const html = template({
      email,
      code: code.value
    })
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Verify your email address',
      html
    }

    await this.transporter.sendMail(mailOptions)
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
