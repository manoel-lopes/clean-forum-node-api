import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { emailQueue } from '@/infra/queues/email/email-queue'
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'

export const bullBoardPlugin = fastifyPlugin(async function (fastify: FastifyInstance) {
  const serverAdapter = new FastifyAdapter()
  serverAdapter.setBasePath('/admin/queues')
  createBullBoard({
    queues: [new BullMQAdapter(emailQueue.queue)],
    serverAdapter,
  })
  await fastify.register(serverAdapter.registerPlugin(), {
    prefix: '/admin/queues',
  })
  fastify.log.info('Bull Board available at /admin/queues')
})
