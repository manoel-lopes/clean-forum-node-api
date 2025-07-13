import { Question } from '@/domain/entities/question/question.entity'

import { PrismaAnswerMapper } from './prisma-answer.mapper'
import { type Answer as PrismaAnswer, type Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain (raw: PrismaQuestion & { answers?: PrismaAnswer[] }): Question {
    const question = Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: raw.authorId,
        bestAnswerId: raw.bestAnswerId ?? undefined
      },
      raw.id
    )

    if (raw.answers) {
      question.answers = raw.answers.map(PrismaAnswerMapper.toDomain)
    }

    return question
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
