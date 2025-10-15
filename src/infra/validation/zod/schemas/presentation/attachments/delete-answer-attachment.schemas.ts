import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const deleteAnswerAttachmentParamsSchema = z.object({
  attachmentId: z.uuid()
})

export const deleteAnswerAttachmentResponsesSchema = {
  204: z.null(),
  404: errorResponseSchema,
  500: errorResponseSchema
}
