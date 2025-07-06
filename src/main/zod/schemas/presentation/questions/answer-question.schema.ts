import { z } from 'zod'

export const answerQuestionBodySchema = z.object({
  content: z.string().min(1),
  authorId: z.string().uuid()
})

export const answerQuestionParamsSchema = z.object({
  questionId: z.string().uuid()
})
