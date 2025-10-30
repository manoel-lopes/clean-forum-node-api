import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { extendablePaginationParamsSchema } from '@/infra/validation/zod/schemas/core/pagination-params.schema'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'

export const getQuestionBySlugParamsSchema = z.object({
  slug: z.string(),
})

type IncludeOption = 'comments' | 'attachments' | 'author'

function isValidIncludeOption (value: string): value is IncludeOption {
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

export const getQuestionBySlugResponsesSchema = {
  200: questionSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
