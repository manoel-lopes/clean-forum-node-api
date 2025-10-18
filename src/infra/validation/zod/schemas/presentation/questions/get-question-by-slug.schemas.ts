import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { extendablePaginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { answerSchema } from '@/infra/validation/zod/schemas/domain/answer.schema'
import { answerCommentSchema } from '@/infra/validation/zod/schemas/domain/answer-comment.schema'
import { attachmentSchema } from '@/infra/validation/zod/schemas/domain/attachment.schema'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'
import { questionCommentSchema } from '@/infra/validation/zod/schemas/domain/question-comment.schema'
import { userSchema } from '@/infra/validation/zod/schemas/domain/user.schema'
import { paginatedItemsSchema } from '@/infra/validation/zod/schemas/util/functions/paginated-items.schema'

export const getQuestionBySlugParamsSchema = z.object({
  slug: z.string(),
})

type IncludeOption = 'comments' | 'attachments' | 'author'

function isValidIncludeOption(value: string): value is IncludeOption {
  return value === 'comments' || value === 'attachments' || value === 'author'
}

export const getQuestionBySlugQuerySchema = extendablePaginationParamsSchema
  .extend({
    include: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val): IncludeOption[] | undefined => {
        if (!val) return undefined
        const items = Array.isArray(val) ? val : val.split(',').map((item) => item.trim())
        const validOptions: IncludeOption[] = ['comments', 'attachments', 'author']
        const invalidItems = items.filter((item) => !isValidIncludeOption(item))
        if (invalidItems.length > 0) {
          throw new z.ZodError([
            {
              code: 'custom',
              path: ['include'],
              message: `Invalid include values: ${invalidItems.join(', ')}. Valid options are: ${validOptions.join(', ')}`,
            },
          ])
        }
        return items.filter(isValidIncludeOption)
      }),
    answerIncludes: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((val): IncludeOption[] | undefined => {
        if (!val) return undefined
        const items = Array.isArray(val) ? val : val.split(',').map((item) => item.trim())
        const validOptions: IncludeOption[] = ['comments', 'attachments', 'author']
        const invalidItems = items.filter((item) => !isValidIncludeOption(item))
        if (invalidItems.length > 0) {
          throw new z.ZodError([
            {
              code: 'custom',
              path: ['answerIncludes'],
              message: `Invalid answerIncludes values: ${invalidItems.join(', ')}. Valid options are: ${validOptions.join(', ')}`,
            },
          ])
        }
        return items.filter(isValidIncludeOption)
      }),
  })
  .transform((data) => ({
    ...data,
    pageSize: data.pageSize || data.pageSize,
  }))

const answerWithIncludesSchema = answerSchema.extend({
  comments: z.array(answerCommentSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  author: userSchema.pick({ id: true, name: true, email: true, createdAt: true, updatedAt: true }).optional(),
})

export const getQuestionBySlugResponsesSchema = {
  200: questionSchema.extend({
    answers: paginatedItemsSchema(answerWithIncludesSchema),
    comments: z.array(questionCommentSchema).optional(),
    attachments: z.array(attachmentSchema).optional(),
    author: userSchema.pick({ id: true, name: true, email: true, createdAt: true, updatedAt: true }).optional(),
  }),
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
