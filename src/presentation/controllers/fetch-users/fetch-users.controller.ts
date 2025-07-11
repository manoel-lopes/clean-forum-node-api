import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest } from '@/infra/http/ports/http-protocol'

import { ok } from '@/presentation/helpers/http-helpers'

export class FetchUsersController implements WebController {
  constructor (private readonly fetchUsersUseCase: UseCase) {}

  async handle (req: HttpRequest) {
    const page = req.query?.page ?? 1
    const pageSize = req.query?.pageSize ?? 20

    const users = await this.fetchUsersUseCase.execute({ page, pageSize })
    return ok(users)
  }
}
