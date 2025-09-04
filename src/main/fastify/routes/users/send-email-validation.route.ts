import type { FastifyInstance } from 'fastify'
import {
  sendEmailValidationBodySchema,
  sendEmailValidationResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/users/send-email-validation.schemas'
import { makeSendEmailValidationController } from '@/main/factories/send-email-validation.factory'
import { adaptRoute } from '@/util/adapt-route'
import { userCreationRateLimit } from '../../plugins/rate-limit'

export async function sendEmailValidationRoute (app: FastifyInstance, tags: string[]) {
  app.post('/send-email-validation', {
    schema: {
      tags,
      summary: 'Send email validation',
      description: 'Send validation code to email address',
      body: sendEmailValidationBodySchema,
      response: sendEmailValidationResponsesSchema
    },
    config: {
      rateLimit: userCreationRateLimit
    }
  },
  adaptRoute(makeSendEmailValidationController(app))
  )
}
