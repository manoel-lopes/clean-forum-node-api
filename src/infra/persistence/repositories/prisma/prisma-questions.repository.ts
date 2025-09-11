import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  QuestionsRepository,
  UpdateQuestionData
} from '@/application/repositories/questions.repository'
import { PrismaQuestionMapper } from '@/infra/persistence/mappers/prisma/prisma-question.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Question } from '@/domain/entities/question/question.entity'

export class PrismaQuestionsRepository implements QuestionsRepository {
  async save (question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)
    await prisma.question.create({ data })
  }

  async findById (questionId: string): Promise<Question | null> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })
    return !question ? null : PrismaQuestionMapper.toDomain(question)
  }

  async findByTitle (title: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
      where: { title },
    })
    return !question ? null : PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug ({ slug, page, pageSize, order }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const [question, totalAnswers] = await prisma.$transaction([
      prisma.question.findUnique({
        where: { slug },
        include: {
          answers: {
            take: pageSize,
            skip: (page - 1) * pageSize,
            orderBy: { createdAt: order ?? 'desc' },
          }
        }
      }),
      prisma.answer.count({
        where: {
          question: { slug }
        }
      })
    ])

    if (!question) {
      return null
    }

    const totalPages = Math.ceil(totalAnswers / pageSize)
    const { answers, ...rest } = PrismaQuestionMapper.toDomain(question)
    return {
      ...rest,
      answers: {
        page,
        pageSize: Math.min(pageSize, totalAnswers),
        totalItems: totalAnswers,
        totalPages,
        items: answers,
        order: order || 'desc'
      }
    }
  }

  async findMany ({ page, pageSize: requestedPageSize, order = 'desc' }: PaginationParams): Promise<PaginatedItems<Question>> {
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: (page - 1) * requestedPageSize,
        take: requestedPageSize,
        orderBy: { createdAt: order ?? 'desc' }
      }),
      prisma.question.count()
    ])
    const totalPages = Math.ceil(totalItems / requestedPageSize)
    return {
      page,
      pageSize: requestedPageSize,
      totalItems,
      totalPages,
      order,
      items: questions.filter(Boolean).map(PrismaQuestionMapper.toDomain),
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
