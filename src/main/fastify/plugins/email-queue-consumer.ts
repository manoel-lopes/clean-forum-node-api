import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { EmailQueueConsumer } from '@/infra/queues/email/email-queue.consumer'

declare module 'fastify' {
  interface FastifyInstance {
    emailQueueConsumer: EmailQueueConsumer
  }
}

export const emailQueueConsumerPlugin = fastifyPlugin(
  async function (fastify: FastifyInstance) {
    const emailQueueConsumer = new EmailQueueConsumer(fastify)
    fastify.decorate('emailQueueConsumer', emailQueueConsumer)
    fastify.addHook('onClose', async () => {
      await emailQueueConsumer.close()
    })
  }
)
