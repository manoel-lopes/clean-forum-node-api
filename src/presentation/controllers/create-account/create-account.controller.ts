import type { UseCase } from '@/core/application/use-case'
import type { WebController } from '@/core/presentation/web-controller'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import { UserWithEmailAlreadyRegisteredError } from '@/application/usecases/create-account/errors/user-with-email-already-registered.error'

import { conflict, created } from '@/presentation/helpers/http-helpers'

export class CreateAccountController implements WebController {
  constructor (private readonly createAccountUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
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
