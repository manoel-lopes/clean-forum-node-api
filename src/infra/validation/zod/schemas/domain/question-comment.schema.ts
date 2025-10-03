import z from 'zod'
import type { QuestionComment } from '@/domain/models/question-comment/question-comment.model'

export const questionCommentSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  authorId: z.uuid(),
  questionId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<QuestionComment>
