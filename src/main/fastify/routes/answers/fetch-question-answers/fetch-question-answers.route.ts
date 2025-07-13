import type { FastifyInstance } from 'fastify'
import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { fetchQuestionAnswersResponsesSchemas } from '@/infra/validation/zod/schemas/presentation/answers/fetch-question-answers.schemas'
import { makeFetchQuestionAnswersController } from '@/main/factories/fetch-question-answers'
import { adaptRoute } from '@/util/adapt-route'

export async function fetchQuestionAnswersRoute (app: FastifyInstance, tags: string[]) {
  app.get('/:questionId/answers', {
    schema: {
      tags,
      description: 'Fetch a list of answers for a question',
      params: { type: 'object', properties: { questionId: { type: 'string', format: 'uuid' } }, required: ['questionId'] },
      querystring: paginationParamsSchema,
      response: fetchQuestionAnswersResponsesSchemas
    }
  },
  adaptRoute(makeFetchQuestionAnswersController())
  )
}
