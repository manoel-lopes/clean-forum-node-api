import { z } from 'zod'

export const answerQuestionResponsesSchema = z.object({
  answer: z.object({
    id: z.string().uuid(),
    content: z.string(),
    authorId: z.string().uuid(),
    questionId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  }),
})

export type AnswerQuestionResponsesSchema = z.infer<typeof answerQuestionResponsesSchema>
