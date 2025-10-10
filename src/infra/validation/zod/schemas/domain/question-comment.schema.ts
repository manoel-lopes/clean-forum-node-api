import z from 'zod'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'

export const questionCommentSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  authorId: z.uuid(),
  questionId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
}) satisfies z.ZodType<QuestionComment>
