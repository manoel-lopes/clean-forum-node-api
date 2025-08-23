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
    const question = await prisma.question.findUnique({
      where: { slug },
      include: {
        answers: {
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: { createdAt: order ?? 'desc' },
        }
      }
    })

    if (!question) {
      return null
    }

    const totalAnswers = await prisma.answer.count({
      where: {
        questionId: question.id
      }
    })
    const totalPages = Math.ceil(totalAnswers / pageSize)
    const { answers, ...rest } = PrismaQuestionMapper.toDomain(question)
    return {
      ...rest,
      answers: {
        page,
        pageSize,
        totalItems: totalAnswers,
        totalPages,
        items: answers,
        order
      }
    }
  }

  async delete (questionId: string): Promise<void> {
    await prisma.question.delete({
      where: { id: questionId },
    })
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const { where, data } = questionData
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorId, ...restData } = data
    const question = await prisma.question.update({
      where,
      data: restData,
    })
    return PrismaQuestionMapper.toDomain(question)
  }

  async findMany ({ page, pageSize, order }: PaginationParams): Promise<PaginatedItems<Question>> {
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: order ?? 'desc' },
        include: { answers: true }
      }),
      prisma.question.count()
    ])
    const totalPages = Math.ceil(totalItems / pageSize)
    const actualPageSize = Math.min(pageSize, totalItems)
    return {
      page,
      pageSize: actualPageSize,
      totalItems,
      totalPages,
      items: questions.map(PrismaQuestionMapper.toDomain)
    }
  }
}
