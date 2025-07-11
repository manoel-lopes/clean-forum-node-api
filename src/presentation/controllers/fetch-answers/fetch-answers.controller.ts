import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'

import type { HttpRequest } from '@/infra/http/ports/http-protocol'

import { ok } from '@/presentation/helpers/http-helpers'

export class FetchAnswersController implements WebController {
  constructor (private readonly fetchAnswersUseCase: UseCase) {}

  async handle (req: HttpRequest) {
    const page = req.query?.page ?? 1
    const pageSize = req.query?.pageSize ?? 20

    const answers = await this.fetchAnswersUseCase.execute({ page, pageSize })
    return ok(answers)
  }
}
