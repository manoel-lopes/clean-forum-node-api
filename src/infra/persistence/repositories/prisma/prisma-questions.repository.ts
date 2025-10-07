import { uuidv7 } from 'uuidv7'
import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  QuestionsRepository,
  UpdateQuestionData
} from '@/domain/application/repositories/questions.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'

export class PrismaQuestionsRepository implements QuestionsRepository {
  async save (question: QuestionProps): Promise<Question> {
    const createdQuestion = await prisma.question.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...question,
        bestAnswerId: question.bestAnswerId ?? null,
        answers: []
      }
    })
    return { ...createdQuestion, answers: [] } as Question
  }

  async findById (questionId: string): Promise<Question | null> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })
    return question as Question | null
  }

  async findByTitle (title: string): Promise<Question | null> {
    const question = await prisma.question.findFirst({
      where: { title },
    })
    return question as Question | null
  }

  async findBySlug ({ slug, page = 1, pageSize = 10, order = 'desc' }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const [question, totalAnswers] = await prisma.$transaction([
      prisma.question.findUnique({
        where: { slug },
        include: {
          answers: {
            take: pageSize,
            skip: (page - 1) * pageSize,
            orderBy: { createdAt: order },
            include: {
              author: true
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
        page,
        pageSize: Math.min(pageSize, totalAnswers),
        totalItems: totalAnswers,
        totalPages: Math.ceil(totalAnswers / pageSize),
        items: answers.map(answer => ({
          ...answer,
          excerpt: answer.content.substring(0, 45).replace(/ $/, '').concat('...')
        })),
        order
      }
    } as FindQuestionsResult
  }

  async findMany ({ page = 1, pageSize = 10, order = 'desc' }: PaginationParams): Promise<PaginatedItems<Question>> {
    const [questions, totalItems] = await prisma.$transaction([
      prisma.question.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: order }
      }),
      prisma.question.count()
    ])
    return {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      order,
      items: questions as Question[],
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
        content: data.content,
        bestAnswerId: data.bestAnswerId
      },
    })
    return updatedQuestion as Question
  }
}
