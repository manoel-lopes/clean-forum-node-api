import z from 'zod'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

export const answerCommentSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  authorId: z.uuid(),
  answerId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<AnswerComment>
