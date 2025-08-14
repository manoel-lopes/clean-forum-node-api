import type { FastifyInstance } from 'fastify'
import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { fetchQuestionAnswersParamsSchema, fetchQuestionAnswersResponsesSchemas } from '@/infra/validation/zod/schemas/presentation/answers/fetch-question-answers.schemas'
import { makeFetchQuestionAnswersController } from '@/main/factories/fetch-question-answers'
import { adaptRoute } from '@/util/adapt-route'

export async function fetchQuestionAnswersRoute (app: FastifyInstance, tags: string[]) {
  app.get('/:questionId/answers', {
    schema: {
      tags,
      description: 'Fetch a list of answers for a question',
      params: fetchQuestionAnswersParamsSchema,
      querystring: paginationParamsSchema,
      response: fetchQuestionAnswersResponsesSchemas
    }
  },
  adaptRoute(makeFetchQuestionAnswersController())
  )
}
