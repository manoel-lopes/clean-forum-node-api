import { z } from 'zod'
import { paginationParamsSchema } from '../../core/pagination-params.schema'

type IncludeOption = 'comments' | 'attachments' | 'author'

function isValidIncludeOption (value: string): value is IncludeOption {
  return value === 'comments' || value === 'attachments' || value === 'author'
}

export const paginationWithIncludeParamsSchema = paginationParamsSchema.extend({
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
})
