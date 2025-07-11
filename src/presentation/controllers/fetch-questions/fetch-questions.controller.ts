import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest } from '@/infra/http/ports/http-protocol'

import { ok } from '@/presentation/helpers/http-helpers'

export class FetchQuestionsController implements WebController {
  constructor (private readonly fetchQuestionsUseCase: UseCase) {}

  async handle (req: HttpRequest) {
    const page = Number(req.query?.page ?? 1)
    const pageSize = Number(req.query?.pageSize ?? 20)

    const questions = await this.fetchQuestionsUseCase.execute({ page, pageSize })
    return ok(questions)
  }
}
