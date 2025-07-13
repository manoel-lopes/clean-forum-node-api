import type { WebController } from '@/core/presentation/web-controller'

import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

import type { AnswersRepository } from '@/application/repositories/answers.repository'

import { ok } from '@/presentation/helpers/http-helpers'

export class FetchAnswersController implements WebController {
  constructor (private readonly answersRepository: AnswersRepository) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    const page = req.query?.page ?? 1
    const pageSize = req.query?.pageSize ?? 20
    const answers = await this.answersRepository.findMany({ page, pageSize })
    return ok(answers)
  }
}
