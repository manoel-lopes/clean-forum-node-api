import { type JobsOptions, Queue } from 'bullmq'
import { env } from '@/lib/env'

export type QueueConfig = {
  name: string
  defaultJobOptions?: JobsOptions
}

export class QueueService<T> {
  readonly queue: Queue<T>

  constructor(config: QueueConfig) {
    this.queue = new Queue<T>(config.name, {
      connection: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        db: env.REDIS_DB,
        maxRetriesPerRequest: 3,
      },
      defaultJobOptions: config.defaultJobOptions ?? {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          count: 100,
          age: 24 * 3600,
        },
        removeOnFail: {
          count: 1000,
        },
      },
    })
  }

  async getStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
    ])
    return {
      waiting,
      active,
      completed,
      failed,
    }
  }

  async close(): Promise<void> {
    await this.queue.close()
  }

  get name(): string {
    return this.queue.name
  }
}
