import { z } from 'zod'

export const chooseQuestionBestAnswerBodySchema = z.object({
  authorId: z.string().uuid()
})

export const chooseQuestionBestAnswerParamsSchema = z.object({
  answerId: z.string().uuid()
})
