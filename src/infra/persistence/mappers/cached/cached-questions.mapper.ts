import type {
  PaginatedQuestions,
} from '@/domain/application/repositories/questions.repository'
import type { Question } from '@/domain/enterprise/entities/question.entity'

type CachedQuestion = Omit<Question, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedQuestionsMapper {
  static toDomain (cache: string): Question | null {
    const item: unknown = JSON.parse(cache)
    if (!item || typeof item !== 'object') return null
    if (!('id' in item) || typeof item.id !== 'string') return null
    if (!('authorId' in item) || typeof item.authorId !== 'string') return null
    if (!('title' in item) || typeof item.title !== 'string') return null
    if (!('content' in item) || typeof item.content !== 'string') return null
    if (!('slug' in item) || typeof item.slug !== 'string') return null
    if (!('createdAt' in item) || typeof item.createdAt !== 'string') return null
    const question: Question = {
      id: item.id,
      authorId: item.authorId,
      title: item.title,
      content: item.content,
      slug: item.slug,
      bestAnswerId: 'bestAnswerId' in item && (item.bestAnswerId === null || typeof item.bestAnswerId === 'string') ? item.bestAnswerId : null,
      createdAt: new Date(item.createdAt),
      updatedAt: 'updatedAt' in item && typeof item.updatedAt === 'string' ? new Date(item.updatedAt) : new Date(item.createdAt),
    }
    return question
  }

  static toPaginatedDomain (cache: string): PaginatedQuestions {
    const parsed: unknown = JSON.parse(cache)
    if (!parsed || typeof parsed !== 'object') {
      return {
        items: [],
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
        order: 'desc',
      }
    }
    if (!('items' in parsed) || !Array.isArray(parsed.items)) {
      return {
        items: [],
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0,
        order: 'desc',
      }
    }
    const items = parsed.items
      .map((item) => this.toDomain(JSON.stringify(item)))
      .filter((item): item is Question => item !== null)
    return {
      items,
      page: 'page' in parsed && typeof parsed.page === 'number' ? parsed.page : 1,
      pageSize: 'pageSize' in parsed && typeof parsed.pageSize === 'number' ? parsed.pageSize : 20,
      totalItems: 'totalItems' in parsed && typeof parsed.totalItems === 'number' ? parsed.totalItems : 0,
      totalPages: 'totalPages' in parsed && typeof parsed.totalPages === 'number' ? parsed.totalPages : 0,
      order: 'order' in parsed && (parsed.order === 'asc' || parsed.order === 'desc') ? parsed.order : 'desc',
    }
  }

  static toPersistence (question: Question): string {
    const cached: CachedQuestion = {
      id: question.id,
      authorId: question.authorId,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt.toISOString(),
      updatedAt: question.updatedAt?.toISOString(),
    }
    return JSON.stringify(cached)
  }

  static toPaginatedPersistence (questions: PaginatedQuestions): string {
    const items = questions.items.map((q) => JSON.parse(this.toPersistence(q)))
    return JSON.stringify({ ...questions, items })
  }
}
