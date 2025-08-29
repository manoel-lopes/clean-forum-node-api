import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { RepositoryFactory } from '@/application/repositories/factories/repository.factory'
import type { QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { CachedRepositoriesFactory } from './cached-repositories.factory'

export class CachedRepositoriesAdapterFactory implements RepositoryFactory {
  createUsersRepository (): UsersRepository {
    return CachedRepositoriesFactory.createUsersRepository()
  }

  createQuestionsRepository (): QuestionsRepository {
    return CachedRepositoriesFactory.createQuestionsRepository()
  }

  createAnswersRepository (): AnswersRepository {
    return CachedRepositoriesFactory.createAnswersRepository()
  }

  createAnswerCommentsRepository (): AnswerCommentsRepository {
    return CachedRepositoriesFactory.createAnswerCommentsRepository()
  }

  createQuestionCommentsRepository (): QuestionCommentsRepository {
    return CachedRepositoriesFactory.createQuestionCommentsRepository()
  }

  createRefreshTokensRepository (): RefreshTokensRepository {
    return CachedRepositoriesFactory.createRefreshTokensRepository()
  }
}
