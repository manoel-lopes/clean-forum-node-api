import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UpdateCommentData } from '@/domain/application/repositories/base/comments.repository'
import type {
  PaginatedQuestionComments,
  QuestionCommentsRepository,
} from '@/domain/application/repositories/question-comments.repository'
import { PrismaQuestionCommentMapper } from '@/infra/persistence/mappers/prisma/prisma-question-comment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import { BasePrismaRepository } from '@/infra/persistence/repositories/prisma/base/base-prisma.repository'
import type { QuestionComment, QuestionCommentProps } from '@/domain/enterprise/entities/question-comment.entity'

export class PrismaQuestionCommentsRepository extends BasePrismaRepository implements QuestionCommentsRepository {
  async create (data: QuestionCommentProps): Promise<QuestionComment> {
    const comment = await prisma.comment.create({ data })
    return PrismaQuestionCommentMapper.toDomain(comment)
  }

  async update ({ where, data }: UpdateCommentData): Promise<QuestionComment> {
    const updatedComment = await prisma.comment.update({ where, data })
    return PrismaQuestionCommentMapper.toDomain(updatedComment)
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })
    if (!comment || !comment.questionId) return null
    return PrismaQuestionCommentMapper.toDomain(comment)
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const pagination = this.sanitizePagination(page, pageSize)
    const [comments, totalItems] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { questionId },
        orderBy: { createdAt: order },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.comment.count({ where: { questionId } }),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
      items: comments.map((comment) => PrismaQuestionCommentMapper.toDomain(comment)),
      order,
    }
  }

  async findAll (): Promise<QuestionComment[]> {
    const comments = await prisma.comment.findMany({
      where: { questionId: { not: null } },
    })
    return comments.map((comment) => PrismaQuestionCommentMapper.toDomain(comment))
  }

  async delete (commentId: string) {
    await prisma.comment.delete({ where: { id: commentId } })
  }
}
