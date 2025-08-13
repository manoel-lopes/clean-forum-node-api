import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import type { AuthenticateUserResponse } from '@/application/usecases/authenticate-user/authenticate-user.usecase'
import { InvalidPasswordError } from '@/application/usecases/authenticate-user/errors/invalid-password.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { notFound, ok, unauthorized } from '@/presentation/helpers/http-helpers'

export class AuthenticateUserController implements WebController {
  constructor (private readonly authenticateUserUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = req.body
      const { token } = await this.authenticateUserUseCase.execute({
        email,
        password
      }) as AuthenticateUserResponse
      return ok({ token })
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
