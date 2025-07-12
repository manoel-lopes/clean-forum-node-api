import type { WebController } from '@/core/presentation/web-controller'

import type { HttpRequest } from '@/infra/http/ports/http-protocol'

import type { UsersRepository } from '@/application/repositories/users.repository'

import { ok } from '@/presentation/helpers/http-helpers'

export class FetchUsersController implements WebController {
  constructor (private readonly usersRepository: UsersRepository) {}

  async handle (req: HttpRequest) {
    const page = req.query?.page ?? 1
    const pageSize = req.query?.pageSize ?? 20
    const users = await this.usersRepository.findMany({ page, pageSize })
    return ok(users)
  }
}
