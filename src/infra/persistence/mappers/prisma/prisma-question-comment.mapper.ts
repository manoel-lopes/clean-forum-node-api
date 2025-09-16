import { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { type Comment as PrismaComment } from '@prisma/client'

export abstract class PrismaQuestionCommentMapper {
  static toDomain (raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Question ID is required')
    }
    return QuestionComment.create(
      {
        content: raw.content,
        authorId: raw.authorId,
        questionId: raw.questionId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id
    )
  }

  static toPrisma (questionComment: QuestionComment): QuestionComment {
    return {
      id: questionComment.id,
      content: questionComment.content,
      authorId: questionComment.authorId,
      questionId: questionComment.questionId,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    }
  }
}
