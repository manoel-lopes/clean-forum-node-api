import { RedisService } from '@/infra/providers/cache/redis-service'
import { CachedAnswerCommentsRepository } from '../repositories/cached/cached-answer-comments.repository'
import { CachedQuestionCommentsRepository } from '../repositories/cached/cached-question-comments.repository'
import { CachedRefreshTokensRepository } from '../repositories/cached/cached-refresh-tokens.repository'
import { CachedUsersRepository } from '../repositories/cached/cached-users.repository'
import { PrismaAnswerCommentsRepository } from '../repositories/prisma/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from '../repositories/prisma/prisma-answers.repository'
import { PrismaQuestionCommentsRepository } from '../repositories/prisma/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from '../repositories/prisma/prisma-questions.repository'
import { PrismaRefreshTokensRepository } from '../repositories/prisma/prisma-refresh-tokens.repository'
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
    return new PrismaAnswersRepository()
  }

  static createQuestionCommentsRepository () {
    const questionCommentsRepository = new PrismaQuestionCommentsRepository()
    return new CachedQuestionCommentsRepository(this.redis, questionCommentsRepository)
  }

  static createAnswerCommentsRepository () {
    const answerCommentsRepository = new PrismaAnswerCommentsRepository()
    return new CachedAnswerCommentsRepository(this.redis, answerCommentsRepository)
  }

  static createRefreshTokensRepository () {
    const refreshTokensRepository = new PrismaRefreshTokensRepository()
    return new CachedRefreshTokensRepository(this.redis, refreshTokensRepository)
  }
}
