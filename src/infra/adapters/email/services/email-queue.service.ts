import { QueueService } from '@/infra/queue/queue.service'

export type EmailJob = {
  to: string
  subject: string
  html: string
  code?: string
}

export class EmailQueueService {
  private readonly queue: QueueService<EmailJob>

  constructor () {
    this.queue = new QueueService<EmailJob>({
      name: 'emails'
    })
  }

  async addEmailJob (data: EmailJob): Promise<void> {
    await this.queue.queue.add('send-email', data, {
      priority: data.code ? 1 : 5
    })
  }

  async getQueueStats () {
    return await this.queue.getStats()
  }

  async close (): Promise<void> {
    await this.queue.close()
  }

  get queueName (): string {
    return this.queue.name
  }
}
