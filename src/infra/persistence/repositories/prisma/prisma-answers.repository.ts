import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'

import { PrismaAnswerMapper } from '@/infra/persistence/mappers/prisma/prisma-answer.mapper'
import { prisma } from '@/infra/persistence/prisma/client'

import type { AnswersRepository } from '@/application/repositories/answers.repository'

import type { Answer } from '@/domain/entities/answer/answer.entity'

export class PrismaAnswersRepository implements AnswersRepository {
  async save (answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)
    await prisma.answer.create({ data })
  }

  async findById (answerId: string): Promise<Answer | null> {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    })
    return !answer ? null : PrismaAnswerMapper.toDomain(answer)
  }

  async delete (answerId: string): Promise<void> {
    await prisma.answer.delete({
      where: { id: answerId },
    })
  }

  async findMany ({ page, pageSize }: PaginationParams): Promise<PaginatedItems<Answer>> {
    const answers = await prisma.answer.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    })
    const totalItems = await prisma.answer.count()
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      items: answers.map(PrismaAnswerMapper.toDomain)
    }
  }
}
