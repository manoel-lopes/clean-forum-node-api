import type { IncludeOption } from '@/domain/application/repositories/base/querys'
import type {
  FindManyQuestionsParams,
  FindQuestionBySlugParams,
  FindQuestionsResult,
  PaginatedQuestions,
  PaginationWithIncludeParams,
  QuestionsRepository,
  UpdateQuestionData,
} from '@/domain/application/repositories/questions.repository'
import { PrismaQuestionMapper } from '@/infra/persistence/mappers/prisma/prisma-question.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'
import { BasePrismaRepository } from './base/base-prisma.repository'

export class PrismaQuestionsRepository extends BasePrismaRepository implements QuestionsRepository {
  async create (data: QuestionProps): Promise<Question> {
    const question = await prisma.question.create({ data })
    return question
  }

  async delete (questionId: string) {
    await prisma.question.delete({
      where: { id: questionId },
    })
  }

  async update ({ data, where }: UpdateQuestionData): Promise<Question> {
    const updatedQuestion = await prisma.question.update({
      where: {
        id: where.id,
      },
      data,
    })
    return updatedQuestion
  }

  async findById (questionId: string): Promise<Question | null> {
    return await prisma.question.findUnique({
      where: { id: questionId },
    })
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    return await prisma.question.findFirst({
      where: { title: questionTitle },
    })
  }

  async findBySlug ({
    slug,
    page = 1,
    pageSize = 10,
    order = 'desc',
    include = [],
    answerIncludes = [],
  }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const pagination = this.sanitizePagination(page, pageSize)
    const [question, totalAnswers] = await prisma.$transaction([
      prisma.question.findUnique({
        where: { slug },
        include: {
          answers: {
            take: pagination.take,
            skip: pagination.skip,
            orderBy: { createdAt: order },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
              comments: this.getComments(answerIncludes),
              attachments: this.getAttachments(answerIncludes),
            },
          },
          comments: this.getComments(include),
          attachments: this.getAttachments(include),
          author: this.getAuthor(include),
        },
      }),
      prisma.answer.count({ where: { question: { slug } } }),
    ])
    if (!question) return null
    return PrismaQuestionMapper.toDomain(question, {
      page: pagination.page,
      pageSize: Math.min(pagination.pageSize, totalAnswers),
      totalItems: totalAnswers,
      totalPages: this.calculateTotalPages(totalAnswers, pagination.pageSize),
      order,
    })
  }

  async findMany ({
    page = 1,
    pageSize = 20,
    order = 'desc',
    include = [],
  }: FindManyQuestionsParams): Promise<PaginatedQuestions> {
    const pagination = this.sanitizePagination(page, pageSize)
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order },
        include: {
          author: this.getAuthor(include),
          comments: this.getComments(include),
          attachments: this.getAttachments(include),
        },
      }),
      prisma.question.count(),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
      order,
      items: questions.map(PrismaQuestionMapper.toQuestion),
    }
  }

  async findManyByUserId (
    userId: string,
    {
      page = 1,
      pageSize = 10,
      order = 'desc',
      include = [],
    }: PaginationWithIncludeParams
  ): Promise<PaginatedQuestions> {
    const pagination = this.sanitizePagination(page, pageSize)
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        where: { authorId: userId },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order },
        include: {
          author: this.getAuthor(include),
          comments: this.getComments(include),
          attachments: this.getAttachments(include),
        },
      }),
      prisma.question.count({
        where: { authorId: userId },
      }),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
      order,
      items: questions.map(PrismaQuestionMapper.toQuestion),
    }
  }

  private getAuthor (include: IncludeOption[] | IncludeOption[]) {
    return include.includes('author') ? {
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    } : false
  }

  private getComments (include: IncludeOption[] | IncludeOption[]) {
    return include.includes('comments') ? { orderBy: { createdAt: 'desc' as const } } : false
  }

  private getAttachments (include: IncludeOption[] | IncludeOption[]) {
    return include.includes('attachments') ? { orderBy: { createdAt: 'desc' as const } } : false
  }
}
