import { z } from 'zod'

export const deleteQuestionSchema = z.object({
  questionId: z.string().uuid()
})
