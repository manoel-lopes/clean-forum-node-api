import { Answer } from '@/domain/models/answer/answer.model'
import { type Answer as PrismaAnswer } from '@prisma/client'

export abstract class PrismaAnswerMapper {
  static toDomain (raw: PrismaAnswer): Answer {
    const answer = new Answer(raw.content, raw.questionId, raw.authorId, raw.id)
    Object.assign(answer, {
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
    return answer
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
