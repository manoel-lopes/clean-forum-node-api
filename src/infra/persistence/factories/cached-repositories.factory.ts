import { RedisService } from '@/infra/providers/cache/redis-service'
import { CachedAnswerCommentsRepository } from '../repositories/cached/cached-answer-comments.repository'
import { CachedAnswersRepository } from '../repositories/cached/cached-answers.repository'
import { CachedEmailValidationsRepository } from '../repositories/cached/cached-email-validations.repository'
import { CachedQuestionCommentsRepository } from '../repositories/cached/cached-question-comments.repository'
import { CachedQuestionsRepository } from '../repositories/cached/cached-questions.repository'
import { CachedRefreshTokensRepository } from '../repositories/cached/cached-refresh-tokens.repository'
import { CachedUsersRepository } from '../repositories/cached/cached-users.repository'
import { PrismaAnswerCommentsRepository } from '../repositories/prisma/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from '../repositories/prisma/prisma-answers.repository'
import { PrismaEmailValidationsRepository } from '../repositories/prisma/prisma-email-validations.repository'
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
    const questionsRepository = new PrismaQuestionsRepository()
    return new CachedQuestionsRepository(this.redis, questionsRepository)
  }

  static createAnswersRepository () {
    const answersRepository = new PrismaAnswersRepository()
    return new CachedAnswersRepository(this.redis, answersRepository)
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

  static createEmailValidationsRepository () {
    const emailValidationsRepository = new PrismaEmailValidationsRepository()
    return new CachedEmailValidationsRepository(this.redis, emailValidationsRepository)
  }
}
