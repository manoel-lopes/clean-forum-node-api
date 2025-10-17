import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type {
  FindQuestionsResult,
  PaginatedQuestions,
  PaginatedQuestionsWithIncludes,
  QuestionWithIncludes,
} from '@/domain/application/repositories/questions.repository'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'
import type { Question } from '@/domain/enterprise/entities/question.entity'

type CachedQuestion = Omit<Question, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedQuestionsMapper extends BaseCachedMapper {
  static toDomain(cache: string): Question | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const question: Question = {
        id: item.id,
        authorId: item.authorId,
        title: item.title,
        content: item.content,
        slug: item.slug,
        bestAnswerId: item.bestAnswerId,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(item.createdAt),
      }
      return question
    }
    return null
  }

  static toPaginatedDomain(cache: string): PaginatedQuestions {
    return super.toPaginated(cache, (cache: string) => {
      const item = JSON.parse(cache)
      const items = Array.isArray(item) ? item : [item]
      return items.map((item) => this.toDomain(JSON.stringify(item))).filter((item): item is Question => item !== null)
    })
  }

  static toFindBySlugDomain(cache: string): FindQuestionsResult {
    const parsed: unknown = JSON.parse(cache)
    if (!parsed || typeof parsed !== 'object') return null
    if (!('question' in parsed)) return null
    const question = this.toDomain(JSON.stringify(parsed.question))
    if (!question) return null
    const defaultAnswers: PaginatedItems<Answer> = {
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
      items: [],
      order: 'desc',
    }
    const answersData = 'answers' in parsed && parsed.answers ? parsed.answers : defaultAnswers
    if (!this.isPaginatedAnswers(answersData)) {
      return null
    }
    return {
      ...question,
      answers: answersData,
    }
  }

  static toFindBySlugPersistence(result: FindQuestionsResult): string {
    if (!result) return JSON.stringify(null)
    const { answers, ...questionPart } = result
    return JSON.stringify({
      question: this.toPersistence(questionPart),
      answers,
    })
  }

  static toPaginatedWithIncludesDomain(cache: string): PaginatedQuestionsWithIncludes {
    return super.toPaginated(cache, (cache: string) => {
      const parsed: unknown = JSON.parse(cache)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      return items
        .map((itemData: unknown) => {
          if (typeof itemData !== 'object' || itemData === null) return null
          if (!('id' in itemData)) return null
          if (!('authorId' in itemData) || !('title' in itemData) || !('content' in itemData)) return null
          if (!('slug' in itemData) || !('createdAt' in itemData)) return null
          const question = this.toDomain(
            JSON.stringify({
              id: itemData.id,
              authorId: itemData.authorId,
              title: itemData.title,
              content: itemData.content,
              slug: itemData.slug,
              bestAnswerId: 'bestAnswerId' in itemData ? itemData.bestAnswerId : null,
              createdAt: itemData.createdAt,
              updatedAt: 'updatedAt' in itemData ? itemData.updatedAt : itemData.createdAt,
            }),
          )
          if (!question) return null
          return {
            ...question,
            ...('comments' in itemData && itemData.comments ? { comments: itemData.comments } : {}),
            ...('attachments' in itemData && itemData.attachments ? { attachments: itemData.attachments } : {}),
            ...('author' in itemData && itemData.author ? { author: itemData.author } : {}),
          }
        })
        .filter((item): item is QuestionWithIncludes => item !== null)
    })
  }

  static toPaginatedWithIncludesPersistence(questions: PaginatedQuestionsWithIncludes): string {
    const { items, ...pagination } = questions
    const persistedItems = items.map((question) => {
      const { comments, attachments, author, ...baseQuestion } = question
      const parsedQuestion: unknown = JSON.parse(this.toPersistence(baseQuestion))
      if (!this.isValid(parsedQuestion)) {
        throw new Error('Invalid cached question after serialization')
      }
      return {
        ...parsedQuestion,
        ...(comments && { comments }),
        ...(attachments && { attachments }),
        ...(author && { author }),
      }
    })
    return JSON.stringify({
      ...pagination,
      items: persistedItems,
    })
  }

  private static isValid(parsedCache: unknown): parsedCache is CachedQuestion {
    return (
      typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'id' in parsedCache &&
      typeof parsedCache.id === 'string' &&
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'title' in parsedCache &&
      typeof parsedCache.title === 'string' &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'slug' in parsedCache &&
      typeof parsedCache.slug === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      (!('updatedAt' in parsedCache) || typeof parsedCache.updatedAt === 'string') &&
      (!('bestAnswerId' in parsedCache) ||
        parsedCache.bestAnswerId === null ||
        typeof parsedCache.bestAnswerId === 'string')
    )
  }

  private static isPaginatedAnswers(value: unknown): value is PaginatedItems<Answer> {
    if (typeof value !== 'object' || value === null) return false
    if (!('page' in value && typeof value.page === 'number')) return false
    if (!('pageSize' in value && typeof value.pageSize === 'number')) return false
    if (!('totalItems' in value && typeof value.totalItems === 'number')) return false
    if (!('totalPages' in value && typeof value.totalPages === 'number')) return false
    if (!('items' in value && Array.isArray(value.items))) return false
    if (!('order' in value && (value.order === 'asc' || value.order === 'desc'))) return false
    return true
  }
}
