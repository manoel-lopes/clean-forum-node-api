import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  QuestionsRepository,
  UpdateQuestionData
} from '@/domain/application/repositories/questions.repository'
import { PrismaQuestionMapper } from '@/infra/persistence/mappers/prisma/prisma-question.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'

export class PrismaQuestionsRepository implements QuestionsRepository {
  async create (data: QuestionProps): Promise<Question> {
    const question = await prisma.question.create({ data })
    return PrismaQuestionMapper.toDomain(question)
  }

  async findById (questionId: string): Promise<Question | null> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })
    if (!question) return null
    return PrismaQuestionMapper.toDomain(question)
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
      where: { title: questionTitle },
    })
    if (!question) return null
    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug ({ slug, page = 1, pageSize = 10, order = 'desc' }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const [question, totalAnswers] = await prisma.$transaction([
      prisma.question.findUnique({
        where: { slug },
        include: {
          answers: {
            take: pageSize,
            skip: (page - 1) * pageSize,
            orderBy: { createdAt: order },
            include: {
              author: true
            }
          }
        }
      }),
      prisma.answer.count({
        where: {
          question: { slug }
        }
      })
    ])

    if (!question) return null
    const { answers, ...rest } = question
    return {
      ...rest,
      answers: {
        page,
        pageSize: Math.min(pageSize, totalAnswers),
        totalItems: totalAnswers,
        totalPages: Math.ceil(totalAnswers / pageSize),
        items: answers,
        order
      }
    }
  }

  async findMany ({ page = 1, pageSize = 10, order = 'desc' }: PaginationParams): Promise<PaginatedItems<Question>> {
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: order }
      }),
      prisma.question.count()
    ])
    return {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      order,
      items: questions.map(question => PrismaQuestionMapper.toDomain(question)),
    }
  }

  async delete (questionId: string): Promise<void> {
    await prisma.question.delete({
      where: { id: questionId },
    })
  }

  async update ({ data, where }: UpdateQuestionData): Promise<Question> {
    const updatedQuestion = await prisma.question.update({
      where: {
        id: where.id,
      },
      data: {
        content: data.content,
        bestAnswerId: data.bestAnswerId
      },
    })
    return PrismaQuestionMapper.toDomain(updatedQuestion)
  }
}
