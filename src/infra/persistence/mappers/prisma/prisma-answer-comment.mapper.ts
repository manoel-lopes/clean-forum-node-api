import { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import { type Comment as PrismaComment } from '@prisma/client'

export abstract class PrismaAnswerCommentMapper {
  static toDomain (raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Answer ID is required')
    }

    return AnswerComment.create(
      {
        content: raw.content,
        authorId: raw.authorId,
        answerId: raw.answerId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id
    )
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
