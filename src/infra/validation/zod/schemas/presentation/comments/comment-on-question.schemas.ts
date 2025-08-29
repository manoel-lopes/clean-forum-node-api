import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { questionCommentSchema } from '../../domain/question-comment.schema'

export const commentOnQuestionBodySchema = z.object({
  questionId: z.uuid(),
  content: z.string().min(1),
})

export const commentOnQuestionResponsesSchema = {
  201: questionCommentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
