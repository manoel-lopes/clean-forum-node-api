import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { UserWithEmailAlreadyRegisteredError } from '@/domain/application/usecases/create-account/errors/user-with-email-already-registered.error'
import { conflict, created } from '@/infra/presentation/helpers/http-helpers'
import type { createAccountBodySchema } from './schemas/create-account.protocol'

export class CreateAccountController implements WebController {
  constructor (private readonly createAccountUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof createAccountBodySchema>
  }>): Promise<HttpResponse> {
    try {
      const { name, email, password } = req.body
      await this.createAccountUseCase.execute({ name, email, password })
      return created()
    } catch (error) {
      if (error instanceof UserWithEmailAlreadyRegisteredError) {
        return conflict(error)
      }
      throw error
    }
  }
}
