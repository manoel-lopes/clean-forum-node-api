import { errorResponseSchema } from '../../core/error-response.schema'
import { answerAttachmentSchema } from '../../domain/attachment.schema'

export const attachToAnswerResponsesSchema = {
  201: answerAttachmentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema,
}
