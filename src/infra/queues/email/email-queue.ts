import { QueueService } from '@/infra/queue/queue.service'

export type EmailJob = {
  to: string
  subject: string
  html: string
  code?: string
}

class EmailQueueSingleton {
  private static instance: QueueService<EmailJob> | null = null

  static getInstance (): QueueService<EmailJob> {
    if (!EmailQueueSingleton.instance) {
      EmailQueueSingleton.instance = new QueueService<EmailJob>({
        name: 'emails',
      })
    }
    return EmailQueueSingleton.instance
  }

  static async close (): Promise<void> {
    if (EmailQueueSingleton.instance) {
      await EmailQueueSingleton.instance.close()
      EmailQueueSingleton.instance = null
    }
  }
}

export const emailQueue = EmailQueueSingleton.getInstance()

export const closeEmailQueue = async (): Promise<void> => {
  await EmailQueueSingleton.close()
}
