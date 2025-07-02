import { z } from 'zod'

export const chooseQuestionBestAnswerSchema = z.object({
  answerId: z.string().uuid(),
})

export type ChooseQuestionBestAnswerSchema = z.infer<typeof chooseQuestionBestAnswerSchema>
