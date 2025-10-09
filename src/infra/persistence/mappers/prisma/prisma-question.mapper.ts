import type { Question } from '@/domain/enterprise/entities/question.entity'
import type { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain (raw: PrismaQuestion): Question {
    return { ...raw, answers: [] }
  }
}
