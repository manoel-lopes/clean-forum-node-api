import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { noContent, notFound } from '@/presentation/helpers/http-helpers'

export class DeleteAccountController implements WebController {
  constructor (private readonly deleteAccountUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = req.params
      await this.deleteAccountUseCase.execute({ userId: id })
      return noContent()
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
