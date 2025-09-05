import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import { PrismaAnswerCommentMapper } from '@/infra/persistence/mappers/prisma/prisma-answer-comment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import { BasePrismaCommentsRepository } from './base/base-prisma-comments.repository'

export class PrismaAnswerCommentsRepository
  extends BasePrismaCommentsRepository
  implements AnswerCommentsRepository {
  async save (comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(comment)
    await prisma.comment.create({ data })
  }

  async update ({ data, where }: UpdateCommentData): Promise<AnswerComment> {
    const updatedComment = await prisma.comment.update({
      where: {
        id: where.id,
      },
      data: {
        content: data.content,
      },
    })
    return PrismaAnswerCommentMapper.toDomain(updatedComment)
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    return comment ? PrismaAnswerCommentMapper.toDomain(comment) : null
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const { page, pageSize, order } = params
    const comments = await prisma.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
    return {
      page,
      pageSize,
      totalItems: comments.length,
      totalPages: Math.ceil(comments.length / pageSize),
      items: comments.filter(Boolean).map(PrismaAnswerCommentMapper.toDomain),
      order: order || 'desc'
    }
  }

  async findAll (): Promise<AnswerComment[]> {
    const comments = await prisma.comment.findMany()
    return comments.filter(Boolean).map(PrismaAnswerCommentMapper.toDomain)
  }
}
