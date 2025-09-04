import type { FastifyInstance } from 'fastify'
import { makeSendEmailValidationController } from '@/main/factories/send-email-validation.factory'
import { userCreationRateLimit } from '@/main/fastify/plugins/rate-limit'
import { adaptRoute } from '@/util/adapt-route'
import { sendEmailValidationSchema } from './schemas/send-email-validation.schema'

export async function sendEmailValidationRoute (fastify: FastifyInstance) {
  const options = {
    schema: sendEmailValidationSchema,
    ...(process.env.NODE_ENV !== 'test' && { preValidation: fastify.rateLimit(userCreationRateLimit) })
  }

  fastify.post('/send-email-validation', options, adaptRoute(makeSendEmailValidationController(fastify)))
}
