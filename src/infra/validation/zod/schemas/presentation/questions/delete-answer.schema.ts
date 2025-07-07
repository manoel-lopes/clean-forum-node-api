import { z } from 'zod'

export const deleteAnswerSchema = z.object({
  answerId: z.string().uuid()
})
