import { AnswerComment } from '@/domain/models/answer-comment/answer-comment.model'
import { type Comment as PrismaComment } from '@prisma/client'

export abstract class PrismaAnswerCommentMapper {
  static toDomain (raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Answer ID is required')
    }
    const answerComment = new AnswerComment(
      raw.authorId,
      raw.content,
      raw.answerId,
      raw.id
    )
    Object.assign(answerComment, {
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined
    })
    return answerComment
  }

  static toPrisma (answerComment: AnswerComment): AnswerComment {
    return {
      id: answerComment.id,
      content: answerComment.content,
      authorId: answerComment.authorId,
      answerId: answerComment.answerId,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    }
  }
}
