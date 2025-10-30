import type {
  AnswersRepository,
  AnswerWithRelations,
  FindManyByQuestionIdParams,
  PaginatedAnswers,
  UpdateAnswerData,
} from '@/domain/application/repositories/answers.repository'
import { PrismaAnswerAttachmentMapper } from '@/infra/persistence/mappers/prisma/prisma-answer-attachment.mapper'
import { PrismaAnswerCommentMapper } from '@/infra/persistence/mappers/prisma/prisma-answer-comment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'
import { BasePrismaRepository } from './base/base-prisma.repository'

export class PrismaAnswersRepository extends BasePrismaRepository implements AnswersRepository {
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
    const includeComments = include.includes('comments')
    const includeAttachments = include.includes('attachments')
    const includeAuthor = include.includes('author')
    const [rawAnswers, totalItems] = await prisma.$transaction([
      prisma.answer.findMany({
        where: { questionId },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order },
        include: {
          comments: includeComments
            ? {
                orderBy: { createdAt: 'desc' },
              }
            : false,
          attachments: includeAttachments
            ? {
                orderBy: { createdAt: 'desc' },
              }
            : false,
          author: includeAuthor
            ? {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  createdAt: true,
                  updatedAt: true,
                },
              }
            : false,
        },
      }),
      prisma.answer.count({ where: { questionId } }),
    ])
    const mappedAnswers: AnswerWithRelations[] = rawAnswers.map((answer) => {
      const mapped: AnswerWithRelations = {
        id: answer.id,
        content: answer.content,
        excerpt: answer.excerpt,
        authorId: answer.authorId,
        questionId: answer.questionId,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt || answer.createdAt,
      }
      if (includeComments && answer.comments) {
        mapped.comments = answer.comments.map(PrismaAnswerCommentMapper.toDomain)
      }
      if (includeAttachments && answer.attachments) {
        mapped.attachments = answer.attachments.map(PrismaAnswerAttachmentMapper.toDomain)
      }
      if (includeAuthor && answer.author) {
        mapped.author = answer.author
      }
      return mapped
    })
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
      order,
      items: mappedAnswers,
    }
  }
}
