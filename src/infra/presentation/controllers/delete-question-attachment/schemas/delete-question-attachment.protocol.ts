import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'

export const deleteQuestionAttachmentParamsSchema = z.object({
  attachmentId: z.uuid(),
})

export const deleteQuestionAttachmentResponsesSchema = {
  204: z.null(),
  404: errorResponseSchema,
  500: errorResponseSchema,
}
