import { RedisService } from '@/infra/providers/cache/redis-service'
import { CachedAnswerAttachmentsRepository } from '../repositories/cached/cached-answer-attachments.repository'
import { CachedAnswerCommentsRepository } from '../repositories/cached/cached-answer-comments.repository'
import { CachedAnswersRepository } from '../repositories/cached/cached-answers.repository'
import { CachedEmailValidationsRepository } from '../repositories/cached/cached-email-validations.repository'
import { CachedQuestionAttachmentsRepository } from '../repositories/cached/cached-question-attachments.repository'
import { CachedQuestionCommentsRepository } from '../repositories/cached/cached-question-comments.repository'
import { CachedQuestionsRepository } from '../repositories/cached/cached-questions.repository'
import { CachedRefreshTokensRepository } from '../repositories/cached/cached-refresh-tokens.repository'
import { CachedUsersRepository } from '../repositories/cached/cached-users.repository'
import { PrismaAnswerAttachmentsRepository } from '../repositories/prisma/prisma-answer-attachments.repository'
import { PrismaAnswerCommentsRepository } from '../repositories/prisma/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from '../repositories/prisma/prisma-answers.repository'
import { PrismaEmailValidationsRepository } from '../repositories/prisma/prisma-email-validations.repository'
import { PrismaQuestionAttachmentsRepository } from '../repositories/prisma/prisma-question-attachments.repository'
import { PrismaQuestionCommentsRepository } from '../repositories/prisma/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from '../repositories/prisma/prisma-questions.repository'
import { PrismaRefreshTokensRepository } from '../repositories/prisma/prisma-refresh-tokens.repository'
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users.repository'

export abstract class CachedRepositoriesFactory {
  private static redis: RedisService

  private static getRedis (): RedisService {
    if (!this.redis) {
      this.redis = new RedisService()
    }
    return this.redis
  }

  static createUsersRepository () {
    const usersRepository = new PrismaUsersRepository()
    return new CachedUsersRepository(this.getRedis(), usersRepository)
  }

  static createQuestionsRepository () {
    const questionsRepository = new PrismaQuestionsRepository()
    return new CachedQuestionsRepository(this.getRedis(), questionsRepository)
  }

  static createAnswersRepository () {
    const answersRepository = new PrismaAnswersRepository()
    return new CachedAnswersRepository(this.getRedis(), answersRepository)
  }

  static createQuestionCommentsRepository () {
    const questionCommentsRepository = new PrismaQuestionCommentsRepository()
    return new CachedQuestionCommentsRepository(this.getRedis(), questionCommentsRepository)
  }

  static createAnswerCommentsRepository () {
    const answerCommentsRepository = new PrismaAnswerCommentsRepository()
    return new CachedAnswerCommentsRepository(this.getRedis(), answerCommentsRepository)
  }

  static createRefreshTokensRepository () {
    const refreshTokensRepository = new PrismaRefreshTokensRepository()
    return new CachedRefreshTokensRepository(this.getRedis(), refreshTokensRepository)
  }

  static createEmailValidationsRepository () {
    const emailValidationsRepository = new PrismaEmailValidationsRepository()
    return new CachedEmailValidationsRepository(this.getRedis(), emailValidationsRepository)
  }

  static createQuestionAttachmentsRepository () {
    const questionAttachmentsRepository = new PrismaQuestionAttachmentsRepository()
    return new CachedQuestionAttachmentsRepository(this.getRedis(), questionAttachmentsRepository)
  }

  static createAnswerAttachmentsRepository () {
    const answerAttachmentsRepository = new PrismaAnswerAttachmentsRepository()
    return new CachedAnswerAttachmentsRepository(this.getRedis(), answerAttachmentsRepository)
  }
}
