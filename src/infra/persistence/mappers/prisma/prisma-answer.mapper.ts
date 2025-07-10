import { Answer } from '@/domain/entities/answer/answer.entity'

import { type Answer as PrismaAnswer } from '@prisma/client'

export abstract class PrismaAnswerMapper {
  static toDomain (raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        authorId: raw.authorId,
        questionId: raw.questionId,
      },
      raw.id
    )
  }

  static toPrisma (answer: Answer): PrismaAnswer {
    return {
      id: answer.id,
      content: answer.content,
      authorId: answer.authorId,
      questionId: answer.questionId,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt ?? new Date(),
    }
  }
}
