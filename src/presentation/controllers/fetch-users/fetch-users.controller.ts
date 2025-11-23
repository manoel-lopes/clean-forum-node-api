import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { ok } from '@/presentation/helpers/http-helpers'

export class FetchUsersController implements WebController {
  constructor (private readonly usersRepository: UsersRepository) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const { page, pageSize, order } = req.query
    const users = await this.usersRepository.findMany({ page, pageSize, order })
    return ok(users)
  }
}
