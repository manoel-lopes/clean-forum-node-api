import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type {
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

  async findBySlug (slug: string): Promise<Question | null> {
    const question = await prisma.question.findUnique({
      where: { slug },
    })
    return !question ? null : PrismaQuestionMapper.toDomain(question)
  }

  async delete (questionId: string): Promise<void> {
    await prisma.question.delete({
      where: { id: questionId },
    })
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const question = await prisma.question.update({
      where: { id: questionData.id },
      data: {
        title: questionData.title,
        content: questionData.content,
        bestAnswerId: questionData.bestAnswerId,
      },
    })
    return PrismaQuestionMapper.toDomain(question)
  }

  async findMany ({ page, pageSize: requestedPageSize }: PaginationParams): Promise<PaginatedItems<Question>> {
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: (page - 1) * requestedPageSize,
        take: requestedPageSize,
        orderBy: { createdAt: 'desc' },
        include: { answers: true }
      }),
      prisma.question.count()
    ])
    const totalPages = Math.ceil(totalItems / requestedPageSize)
    const actualPageSize = Math.min(requestedPageSize, totalItems)
    return {
      page,
      pageSize: actualPageSize,
      totalItems,
      totalPages,
      items: questions.map(PrismaQuestionMapper.toDomain)
    }
  }
}
