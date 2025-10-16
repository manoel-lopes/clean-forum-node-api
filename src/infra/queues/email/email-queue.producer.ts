import { Queue } from 'bullmq'
import { env } from '@/lib/env'

export type EmailJob = {
  to: string
  subject: string
  html: string
  code?: string
}

export class EmailQueueProducer {
  private readonly queue: Queue

  constructor () {
    this.queue = new Queue('emails', {
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        db: env.REDIS_DB,
        maxRetriesPerRequest: 3
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: {
          count: 100,
          age: 24 * 3600
        },
        removeOnFail: {
          count: 1000
        }
      }
    })
  }

  async addJob (data: EmailJob): Promise<void> {
    await this.queue.add('send-email', data, {
      priority: data.code ? 1 : 5
    })
  }

  async getQueueStats () {
    const [waiting, active, completed, failed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount()
    ])
    return {
      waiting,
      active,
      completed,
      failed
    }
  }

  async close (): Promise<void> {
    await this.queue.close()
  }
}
