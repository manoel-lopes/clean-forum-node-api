import { Queue } from 'bullmq'
import { conn } from '@/infra/persistence/redis/conn'

export type EmailJob = {
  to: string
  subject: string
  html: string
  code?: string
}

export class EmailQueueProducer {
  static instance: EmailQueueProducer | null = null
  readonly queue: Queue

  static getInstance (): EmailQueueProducer {
    if (!EmailQueueProducer.instance) {
      EmailQueueProducer.instance = new EmailQueueProducer()
    }
    return EmailQueueProducer.instance
  }

  private constructor () {
    this.queue = new Queue('emails', {
      connection: conn,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    })
  }

  async addJob (data: EmailJob) {
    await this.queue.add('send-email', data, {
      priority: data.code ? 1 : 5,
    })
  }

  async close () {
    await this.queue.close()
  }
}
