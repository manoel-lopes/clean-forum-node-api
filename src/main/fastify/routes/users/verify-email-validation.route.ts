import type { FastifyInstance } from 'fastify'
import {
  verifyEmailValidationBodySchema,
  verifyEmailValidationResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/users/verify-email-validation.schemas'
import { makeVerifyEmailValidationController } from '@/main/factories/verify-email-validation-controller'
import { emailValidationRateLimit } from '../../plugins/rate-limit'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function verifyEmailValidationRoute (app: FastifyInstance, tags: string[]) {
  app.post('/verify-email-validation', {
    schema: {
      tags,
      description: 'Verify email validation code',
      body: verifyEmailValidationBodySchema,
      response: verifyEmailValidationResponsesSchema
    },
    config: {
      rateLimit: emailValidationRateLimit()
    }
  },
  adaptRoute(makeVerifyEmailValidationController())
  )
}
