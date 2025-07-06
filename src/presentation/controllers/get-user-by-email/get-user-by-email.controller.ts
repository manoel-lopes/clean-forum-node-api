import type { UseCase } from '@/core/application/use-case'
import type { WebController } from '@/core/presentation/web-controller'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { notFound, ok } from '@/presentation/helpers/http-helpers'

export class GetUserByEmailController implements WebController {
  constructor (private readonly getUserByEmailUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { email } = req.params

    try {
      const user = await this.getUserByEmailUseCase.execute(email)

      return ok(user)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }

      throw error
    }
  }
}
