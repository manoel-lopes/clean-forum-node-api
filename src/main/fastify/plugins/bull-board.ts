import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { EmailQueueProducer } from '@/infra/queues/email/email-queue.producer'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'

export const bullBoardPlugin = fastifyPlugin(async function (app: FastifyInstance) {
  const serverAdapter = new FastifyAdapter()
  serverAdapter.setBasePath('/admin/queues')
  const { queue: emailQueue } = EmailQueueProducer.getInstance()
  if (!emailQueue) {
    return
  }
  createBullBoard({
    queues: [new BullMQAdapter(emailQueue)],
    serverAdapter,
  })
  await app.register(serverAdapter.registerPlugin(), {
    prefix: '/admin/queues',
  })
  app.log.info('Bull Board available at /admin/queues')
})
