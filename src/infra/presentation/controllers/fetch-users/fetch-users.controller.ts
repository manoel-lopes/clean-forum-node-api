import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { ok } from '@/infra/presentation/helpers/http-helpers'
import type { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'

export class FetchUsersController implements WebController {
  constructor (private readonly usersRepo: UsersRepository) {}

  async handle (req: HttpRequest<{
    query: z.infer<typeof paginationParamsSchema>
  }>): Promise<HttpResponse> {
    const { page, pageSize, order } = req.query
    const users = await this.usersRepo.findMany({ page, pageSize, order })
    return ok(users)
  }
}
