import type { PaginationParams } from '@/core/application/pagination-params'
import type { UpdateCommentData } from '@/application/repositories/base/comments.repository'
import type { PaginatedQuestionComments, QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import { PrismaQuestionCommentMapper } from '@/infra/persistence/mappers/prisma/prisma-question-comment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'

export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  async save (comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(comment)
    await prisma.comment.create({ data })
  }

  async update ({ data, where }: UpdateCommentData): Promise<QuestionComment> {
    const updatedComment = await prisma.comment.update({
      where: {
        id: where.id,
      },
      data: {
        content: data.content,
      },
    })
    return PrismaQuestionCommentMapper.toDomain(updatedComment)
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    return comment ? PrismaQuestionCommentMapper.toDomain(comment) : null
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const [comments, totalItems] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { questionId },
        orderBy: { createdAt: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.comment.count({ where: { questionId } })
    ])
    return {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      items: comments.filter(Boolean).map(PrismaQuestionCommentMapper.toDomain),
      order
    }
  }

  async findAll (): Promise<QuestionComment[]> {
    const comments = await prisma.comment.findMany()
    return comments.filter(Boolean).map(PrismaQuestionCommentMapper.toDomain)
  }

  async delete (commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { id: commentId } })
  }
}
