import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { paginationParamsSchema } from '../../core/pagination-params.schema'
import { questionAttachmentSchema } from '../../domain/attachment.schema'

export const fetchQuestionAttachmentsParamsSchema = z.object({
  questionId: z.uuid(),
})

export const fetchQuestionAttachmentsQuerySchema = paginationParamsSchema

export const fetchQuestionAttachmentsResponsesSchema = {
  200: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    items: z.array(questionAttachmentSchema),
    order: z.enum(['asc', 'desc']),
  }),
  400: errorResponseSchema,
  500: errorResponseSchema,
}
