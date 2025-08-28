import { RedisService } from '@/infra/providers/cache/redis-service'
import { CachedAnswersRepository } from '../repositories/cached/cached-answers.repository'
import { CachedUsersRepository } from '../repositories/cached/cached-users.repository'
import { PrismaAnswersRepository } from '../repositories/prisma/prisma-answers.repository'
import { PrismaQuestionsRepository } from '../repositories/prisma/prisma-questions.repository'
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users.repository'

export abstract class CachedRepositoriesFactory {
  private static readonly redis = new RedisService()

  static createUsersRepository () {
    const usersRepository = new PrismaUsersRepository()
    return new CachedUsersRepository(this.redis, usersRepository)
  }

  static createQuestionsRepository () {
    return new PrismaQuestionsRepository()
  }

  static createAnswersRepository () {
    const answersRepository = new PrismaAnswersRepository()
    return new CachedAnswersRepository(this.redis, answersRepository)
  }
}
