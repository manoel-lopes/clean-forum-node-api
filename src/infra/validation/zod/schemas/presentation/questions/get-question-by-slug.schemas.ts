import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { paginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { answerSchema } from '@/infra/validation/zod/schemas/domain/answer.schema'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'
import { paginatedItemsSchema } from '@/infra/validation/zod/schemas/util/functions/paginated-items.schema'

export const getQuestionBySlugParamsSchema = paginationParamsSchema.extend({
  slug: z.string()
})

export const getQuestionBySlugResponsesSchema = {
  200: questionSchema.extend({
    answers: paginatedItemsSchema(answerSchema)
  }),
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
