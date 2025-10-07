import { uuidv7 } from 'uuidv7'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UpdateCommentData } from '@/domain/application/repositories/base/comments.repository'
import type { PaginatedQuestionComments, QuestionCommentsRepository } from '@/domain/application/repositories/question-comments.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { QuestionComment, QuestionCommentProps } from '@/domain/enterprise/entities/question-comment.entity'

export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  async save (comment: QuestionCommentProps): Promise<QuestionComment> {
    const createdComment = await prisma.comment.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...comment
      }
    })
    return createdComment as QuestionComment
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
    return updatedComment as QuestionComment
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } })
    return comment as QuestionComment | null
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
      items: comments as QuestionComment[],
      order
    }
  }

  async findAll (): Promise<QuestionComment[]> {
    const comments = await prisma.comment.findMany()
    return comments as QuestionComment[]
  }

  async delete (commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { id: commentId } })
  }
}
