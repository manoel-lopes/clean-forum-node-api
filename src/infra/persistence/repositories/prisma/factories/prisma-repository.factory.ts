import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { RepositoryFactory } from '@/application/repositories/factories/repository.factory'
import type { QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { PrismaAnswerCommentsRepository } from '../prisma-answer-comments.repository'
import { PrismaAnswersRepository } from '../prisma-answers.repository'
import { PrismaQuestionCommentsRepository } from '../prisma-question-comments.repository'
import { PrismaQuestionsRepository } from '../prisma-questions.repository'
import { PrismaRefreshTokensRepository } from '../prisma-refresh-tokens.repository'
import { PrismaUsersRepository } from '../prisma-users.repository'

export class PrismaRepositoryFactory implements RepositoryFactory {
  createUsersRepository (): UsersRepository {
    return new PrismaUsersRepository()
  }

  createQuestionsRepository (): QuestionsRepository {
    return new PrismaQuestionsRepository()
  }

  createAnswersRepository (): AnswersRepository {
    return new PrismaAnswersRepository()
  }

  createAnswerCommentsRepository (): AnswerCommentsRepository {
    return new PrismaAnswerCommentsRepository()
  }

  createQuestionCommentsRepository (): QuestionCommentsRepository {
    return new PrismaQuestionCommentsRepository()
  }

  createRefreshTokensRepository (): RefreshTokensRepository {
    return new PrismaRefreshTokensRepository()
  }
}
