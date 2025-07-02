import { z } from 'zod'

export const chooseQuestionBestAnswerResponsesSchema = z.object({
  question: z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    authorId: z.string().uuid(),
    bestAnswerId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export type ChooseQuestionBestAnswerResponsesSchema = z.infer<typeof chooseQuestionBestAnswerResponsesSchema>
