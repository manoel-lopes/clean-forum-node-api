import type { WebController } from '@/core/presentation/web-controller'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ok } from '@/presentation/helpers/http-helpers'
import { UserPresenter } from '@/presentation/presenters/user.presenter'

export class FetchUsersController implements WebController {
  constructor (private readonly usersRepository: UsersRepository) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize, order } = req.query
    const response = await this.usersRepository.findMany({ page, pageSize, order })
    return ok(UserPresenter.toHTTP(response))
  }
}
