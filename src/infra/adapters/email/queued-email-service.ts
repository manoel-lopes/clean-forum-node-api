import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import handlebars, { type TemplateDelegate } from 'handlebars'
import { EmailQueueProducer } from '@/infra/queues/email/email-queue.producer'
import type { EmailService } from './ports/email-service'

export class QueuedEmailService implements EmailService {
  private template: TemplateDelegate
  private readonly emailQueueProducer = new EmailQueueProducer()

  async sendValidationCode (email: string, code: string): Promise<void> {
    const template = await this.getTemplate()
    const html = template({ email, code })
    await this.emailQueueProducer.addJob({
      to: email,
      subject: 'Verify your email address',
      html,
      code,
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
    const paths = ['src', 'infra', 'adapters', 'email', 'templates', 'email-validation.hbs']
    return join(process.cwd(), ...paths)
  }
}
