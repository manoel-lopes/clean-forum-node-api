/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  PaginatedQuestionsWithIncludes,
  QuestionsRepository,
  UpdateQuestionData
} from '@/domain/application/repositories/questions.repository'
import type { PaginationWithIncludeParams } from '@/domain/application/types/questions-include-params'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'
import { sanitizePagination } from '@/lib/pagination'

export class PrismaQuestionsRepository implements QuestionsRepository {
  async create (data: QuestionProps): Promise<Question> {
    const question = await prisma.question.create({ data })
    return question
  }

  async findById (questionId: string): Promise<Question | null> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })
    if (!question) return null
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
      where: { title: questionTitle },
    })
    if (!question) return null
    return question
  }

  async findBySlug ({ slug, page = 1, pageSize = 10, order = 'desc' }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const pagination = sanitizePagination(page, pageSize)
    const [question, totalAnswers] = await prisma.$transaction([
      prisma.question.findUnique({
        where: { slug },
        include: {
          answers: {
            take: pagination.take,
            skip: pagination.skip,
            orderBy: { createdAt: order },
            select: {
              id: true,
              content: true,
              excerpt: true,
              createdAt: true,
              updatedAt: true,
              authorId: true,
              questionId: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        }
      }),
      prisma.answer.count({
        where: {
          question: { slug }
        }
      })
    ])
    if (!question) return null
    const { answers, ...rest } = question
    return {
      ...rest,
      answers: {
        page: pagination.page,
        pageSize: Math.min(pagination.pageSize, totalAnswers),
        totalItems: totalAnswers,
        totalPages: Math.ceil(totalAnswers / pagination.pageSize),
        items: answers,
        order
      }
    }
  }

  async findMany ({ page = 1, pageSize = 20, order = 'desc' }: PaginationParams): Promise<PaginatedItems<Question>> {
    const pagination = sanitizePagination(page, pageSize)
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order }
      }),
      prisma.question.count()
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
      order,
      items: questions,
    }
  }

  async findManyWithIncludes ({ page = 1, pageSize = 20, order = 'desc', include = [] }: PaginationWithIncludeParams): Promise<PaginatedQuestionsWithIncludes> {
    const pagination = sanitizePagination(page, pageSize)
    const includeComments = include.includes('comments')
    const includeAttachments = include.includes('attachments')
    const includeAuthor = include.includes('author')
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order },
        include: {
          comments: includeComments ? {
            where: { answerId: null },
            orderBy: { createdAt: 'desc' }
          } : false,
          attachments: includeAttachments ? {
            where: { answerId: null },
            orderBy: { createdAt: 'desc' }
          } : false,
          author: includeAuthor ? {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true
            }
          } : false
        }
      }),
      prisma.question.count()
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
      order,
      items: questions as PaginatedQuestionsWithIncludes['items'],
    }
  }

  async delete (questionId: string): Promise<void> {
    await prisma.question.delete({
      where: { id: questionId },
    })
  }

  async update ({ data, where }: UpdateQuestionData): Promise<Question> {
    const updatedQuestion = await prisma.question.update({
      where: {
        id: where.id,
      },
      data: {
        title: data.title,
        content: data.content,
        bestAnswerId: data.bestAnswerId
      },
    })
    return updatedQuestion
  }

  async findManyByUserId (
    userId: string,
    { page = 1, pageSize = 10, order = 'desc' }: PaginationParams
  ): Promise<PaginatedItems<Omit<Question, 'answers'>>> {
    const pagination = sanitizePagination(page, pageSize)
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        where: { authorId: userId },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order }
      }),
      prisma.question.count({
        where: { authorId: userId }
      })
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pagination.pageSize),
      order,
      items: questions,
    }
  }
}
