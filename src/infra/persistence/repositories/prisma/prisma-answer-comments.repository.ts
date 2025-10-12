import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/domain/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/domain/application/repositories/base/comments.repository'
import { PrismaAnswerCommentMapper } from '@/infra/persistence/mappers/prisma/prisma-answer-comment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { AnswerComment, AnswerCommentProps } from '@/domain/enterprise/entities/answer-comment.entity'

export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  async create (data: AnswerCommentProps): Promise<AnswerComment> {
    const comment = await prisma.comment.create({ data })
    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async update ({ where, data }: UpdateCommentData): Promise<AnswerComment> {
    const updatedComment = await prisma.comment.update({ where, data })
    return PrismaAnswerCommentMapper.toDomain(updatedComment)
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })
    if (!comment || !comment.answerId) return null
    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params

    const [comments, totalItems] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { answerId },
        orderBy: { createdAt: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.comment.count({ where: { answerId } })
    ])
    return {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      items: comments.map(comment => PrismaAnswerCommentMapper.toDomain(comment)),
      order
    }
  }

  async findAll (): Promise<AnswerComment[]> {
    const comments = await prisma.comment.findMany({
      where: { answerId: { not: null } }
    })
    return comments.map(comment => PrismaAnswerCommentMapper.toDomain(comment))
  }

  async delete (commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { id: commentId } })
  }
}
