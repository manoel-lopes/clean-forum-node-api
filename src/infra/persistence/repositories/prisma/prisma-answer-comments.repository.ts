import { uuidv7 } from 'uuidv7'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/domain/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/domain/application/repositories/base/comments.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { AnswerComment, AnswerCommentProps } from '@/domain/enterprise/entities/answer-comment.entity'

export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  async save (comment: AnswerCommentProps): Promise<AnswerComment> {
    const createdComment = await prisma.comment.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...comment
      }
    })
    return createdComment as AnswerComment
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
    return updatedComment as AnswerComment
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    return comment as AnswerComment | null
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
      items: comments as AnswerComment[],
      order
    }
  }

  async findAll (): Promise<AnswerComment[]> {
    const comments = await prisma.comment.findMany()
    return comments as AnswerComment[]
  }

  async delete (commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { id: commentId } })
  }
}
