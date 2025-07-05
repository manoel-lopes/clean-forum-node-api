import type { WebController } from '@/core/presentation/web-controller'
import type {
  HttpRequest,
  HttpResponse,
} from '@/infra/http/ports/http-protocol'
import type { UseCase } from '@/core/application/use-case'
import { ok, unauthorized, notFound } from '@/presentation/helpers/http-helpers'
import { InvalidPasswordError } from '@/application/usecases/authenticate-user/errors/invalid-password.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export class AuthenticateUserController implements WebController {
  constructor(private readonly authenticateUserUseCase: UseCase) {}

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = req.body
      const user = await this.authenticateUserUseCase.execute({
        email,
        password,
      })
      return ok(user)
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
