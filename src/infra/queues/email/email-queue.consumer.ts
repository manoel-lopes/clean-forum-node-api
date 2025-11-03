import { type Job, Worker } from 'bullmq'
import type { FastifyInstance } from 'fastify'
import { conn } from '@/infra/persistence/redis/conn'
import type { EmailJob } from './email-queue.producer'

export class EmailQueueConsumer {
  private readonly worker: Worker<EmailJob>

  constructor (private readonly fastify: FastifyInstance) {
    this.worker = new Worker<EmailJob>(
      'emails',
      async (job: Job<EmailJob>) => {
        return await this.processEmail(job)
      },
      {
        connection: conn,
        concurrency: 10,
        limiter: {
          max: 100,
          duration: 60000,
        },
      }
    )
    this.setupEventHandlers()
  }

  private async processEmail (job: Job<EmailJob>) {
    const { to, subject, html } = job.data
    try {
      await this.fastify.mailer.sendMail({
        to,
        subject,
        html,
      })
      this.fastify.log.info(
        {
          jobId: job.id,
          to,
          subject,
        },
        'Email sent successfully'
      )
    } catch (error) {
      this.fastify.log.error(
        {
          jobId: job.id,
          to,
          subject,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        'Failed to send email'
      )
      throw error
    }
  }

  private setupEventHandlers (): void {
    this.worker.on('completed', (job) => {
      this.fastify.log.debug(
        {
          jobId: job.id,
          duration: Date.now() - job.processedOn!,
        },
        'Email job completed'
      )
    })
    this.worker.on('failed', (job, error) => {
      this.fastify.log.error(
        {
          jobId: job?.id,
          attempts: job?.attemptsMade,
          error: error.message,
        },
        'Email job failed'
      )
    })
    this.worker.on('error', (error) => {
      this.fastify.log.error({ error: error.message }, 'Worker error')
    })
  }

  async close () {
    await this.worker.close()
  }
}
