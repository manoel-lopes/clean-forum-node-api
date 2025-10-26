import type { QueueService } from '@/infra/queue/queue.service'
import { type EmailJob, emailQueue } from './email-queue'

export class EmailQueueProducer {
  private readonly queueService: QueueService<EmailJob>

  constructor () {
    this.queueService = emailQueue
  }

  async addJob (data: EmailJob): Promise<void> {
    await this.queueService.queue.add('send-email', data)
  }
}
