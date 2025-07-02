import { WebController } from '@core/presentation/web-controller'
import { CreateAccountUseCase } from '@application/usecases/create-account/create-account.usecase'
import { HttpRequest, HttpResponse } from '@infra/adapters/http/ports/http-protocol'
import {
  UserWithEmailAlreadyRegisteredError
} from '@application/usecases/create-account/errors/user-with-email-already-registered.error'
import { conflict, created } from '@presentation/helpers/http-helpers'

export class CreateAccountController implements WebController {
  constructor (private createAccountUseCase: CreateAccountUseCase) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body

      const { user } = await this.createAccountUseCase.execute({
        name,
        email,
        password,
      })

      return created(user)
    } catch (error) {
      if (error instanceof UserWithEmailAlreadyRegisteredError) {
        return conflict(error)
      }

      throw error
    }
  }
}
