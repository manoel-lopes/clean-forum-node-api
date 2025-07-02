import { z } from 'zod'

export const answerQuestionSchema = z.object({
  content: z.string().min(10),
})

export type AnswerQuestionSchema = z.infer<typeof answerQuestionSchema>
