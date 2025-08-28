import type { AnswerCommentsRepository } from '../answer-comments.repository'
import type { AnswersRepository } from '../answers.repository'
import type { QuestionCommentsRepository } from '../question-comments.repository'
import type { QuestionsRepository } from '../questions.repository'
import type { RefreshTokensRepository } from '../refresh-tokens.repository'
import type { UsersRepository } from '../users.repository'

export interface RepositoryFactory {
  createUsersRepository(): UsersRepository
  createQuestionsRepository(): QuestionsRepository
  createAnswersRepository(): AnswersRepository
  createAnswerCommentsRepository(): AnswerCommentsRepository
  createQuestionCommentsRepository(): QuestionCommentsRepository
  createRefreshTokensRepository(): RefreshTokensRepository
}
