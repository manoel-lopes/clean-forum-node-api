import { Question } from '@/domain/entities/question/question.entity'

import { type Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain (raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: raw.authorId,
      },
      raw.id
    )
  }

  static toPrisma (question: Question): PrismaQuestion {
    return {
      id: question.id,
      title: question.title,
      slug: question.slug,
      content: question.content,
      authorId: question.authorId,
      bestAnswerId: question.bestAnswerId ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? new Date(),
    }
  }
}
