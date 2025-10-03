import { QuestionComment } from '@/domain/models/question-comment/question-comment.model'
import { type Comment as PrismaComment } from '@prisma/client'

export abstract class PrismaQuestionCommentMapper {
  static toDomain (raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Question ID is required')
    }
    const questionComment = new QuestionComment(
      raw.authorId,
      raw.content,
      raw.questionId,
      raw.id
    )
    Object.assign(questionComment, {
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined
    })
    return questionComment
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
