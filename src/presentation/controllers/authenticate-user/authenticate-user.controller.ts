import { WebController } from '@core/presentation/web-controller'
import {
  AuthenticateUserUseCase
} from '@application/usecases/authenticate-user/authenticate-user.usecase'
import { HttpRequest, HttpResponse } from '@infra/adapters/http/ports/http-protocol'
import {
  InvalidPasswordError
} from '@application/usecases/authenticate-user/errors/invalid-password.error'
import { ok, unauthorized } from '@presentation/helpers/http-helpers'

export class AuthenticateUserController implements WebController {
  constructor (private authenticateUserUseCase: AuthenticateUserUseCase) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const { accessToken } = await this.authenticateUserUseCase.execute({
        email,
        password,
      })

      return ok({ accessToken })
    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        return unauthorized(error)
      }

      throw error
    }
  }
}
