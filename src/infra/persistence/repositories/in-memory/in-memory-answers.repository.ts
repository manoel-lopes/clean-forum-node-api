import type {
  AnswersRepository
} from '@/application/repositories/answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {}
