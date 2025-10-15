import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { paginationParamsSchema } from '../../core/pagination-params.schema'
import { answerAttachmentSchema } from '../../domain/attachment.schema'

export const fetchAnswerAttachmentsParamsSchema = z.object({
  answerId: z.uuid()
})

export const fetchAnswerAttachmentsQuerySchema = paginationParamsSchema

export const fetchAnswerAttachmentsResponsesSchema = {
  200: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    items: z.array(answerAttachmentSchema),
    order: z.enum(['asc', 'desc'])
  }),
  400: errorResponseSchema,
  500: errorResponseSchema
}
