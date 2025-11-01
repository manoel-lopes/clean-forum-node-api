import type {
  AnswersRepository,
  FindManyByQuestionIdParams,
  PaginatedAnswers,
  UpdateAnswerData,
} from '@/domain/application/repositories/answers.repository'
import type { IncludeOption } from '@/domain/application/repositories/base/querys'
import { PrismaAnswerMapper } from '@/infra/persistence/mappers/prisma/prisma-answer.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'
import { BasePrismaRepository } from './base/base-prisma.repository'

export class PrismaAnswersRepository extends BasePrismaRepository implements AnswersRepository {
  private getAuthorSelect (include: IncludeOption[]) {
    return include.includes('author') ? { select: { id: true, name: true, email: true, createdAt: true, updatedAt: true } } : false
  }

  private getCommentsInclude (include: IncludeOption[]) {
    return include.includes('comments') ? { orderBy: { createdAt: 'desc' as const } } : false
  }

  private getAttachmentsInclude (include: IncludeOption[]) {
    return include.includes('attachments') ? { orderBy: { createdAt: 'desc' as const } } : false
  }

  async create (data: AnswerProps): Promise<Answer> {
    const answer = await prisma.answer.create({ data })
    return answer
  }

  async findById (answerId: string): Promise<Answer | null> {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    })
    return answer
  }

  async delete (answerId: string): Promise<void> {
    await prisma.answer.delete({
      where: { id: answerId },
    })
  }

  async update ({ where, data }: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await prisma.answer.update({ where, data })
    return updatedAnswer
  }

  async findManyByQuestionId ({
    questionId,
    page = 1,
    pageSize = 20,
    order = 'desc',
    include = [],
  }: FindManyByQuestionIdParams): Promise<PaginatedAnswers> {
    const pagination = this.sanitizePagination(page, pageSize)
    const [rawAnswers, totalItems] = await prisma.$transaction([
      prisma.answer.findMany({
        where: { questionId },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order },
        include: {
          comments: this.getCommentsInclude(include),
          attachments: this.getAttachmentsInclude(include),
          author: this.getAuthorSelect(include),
        },
      }),
      prisma.answer.count({ where: { questionId } }),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
      order,
      items: rawAnswers.map(PrismaAnswerMapper.toDomain),
    }
  }
}
