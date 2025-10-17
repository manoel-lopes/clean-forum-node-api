import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { InvalidPasswordError } from '@/domain/application/usecases/authenticate-user/errors/invalid-password.error'
import { notFound, ok, unauthorized } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class AuthenticateUserController implements WebController {
  constructor(private readonly authenticateUserUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = req.body
      const response = await this.authenticateUserUseCase.execute({
        email,
        password,
      })
      return ok(response)
    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        return unauthorized(error)
      }
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
