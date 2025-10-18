import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { extendablePaginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { answerSchema } from '@/infra/validation/zod/schemas/domain/answer.schema'
import { attachmentSchema } from '@/infra/validation/zod/schemas/domain/attachment.schema'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'
import { questionCommentSchema } from '@/infra/validation/zod/schemas/domain/question-comment.schema'
import { userSchema } from '@/infra/validation/zod/schemas/domain/user.schema'
import { paginatedItemsSchema } from '@/infra/validation/zod/schemas/util/functions/paginated-items.schema'

const includeOptionsSchema = z.enum(['comments', 'attachments', 'author'])

export const getQuestionBySlugParamsSchema = extendablePaginationParamsSchema
  .extend({
    slug: z.string(),
    include: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val) => {
        if (!val) return undefined
        if (Array.isArray(val)) return val
        return val.split(',').map((item) => item.trim())
      })
      .pipe(z.array(includeOptionsSchema).optional()),
  })
  .transform((data) => ({
    ...data,
    pageSize: data.pageSize || data.pageSize,
  }))

export const getQuestionBySlugResponsesSchema = {
  200: questionSchema.extend({
    answers: paginatedItemsSchema(answerSchema),
    comments: z.array(questionCommentSchema).optional(),
    attachments: z.array(attachmentSchema).optional(),
    author: userSchema.pick({ id: true, name: true, email: true, createdAt: true, updatedAt: true }).optional(),
  }),
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
