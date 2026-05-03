import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/domain/application/use-case'
import { notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type { getUserByEmailQuerySchema } from './schemas/get-user-by-email.protocol'

export class GetUserByEmailController implements WebController {
  constructor (private readonly getUserByEmailUseCase: UseCase) {}

  async handle (req: HttpRequest<{
    query: z.infer<typeof getUserByEmailQuerySchema>
  }>): Promise<HttpResponse> {
    try {
      const user = await this.getUserByEmailUseCase.execute({
        email: req.query.email,
      })
      return ok(user)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      throw error
    }
  }
}
