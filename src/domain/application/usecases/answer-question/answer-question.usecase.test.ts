import { makeQuestionData } from 'tests/factories/domain/make-question'
import { makeUserData } from 'tests/factories/domain/make-user'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { AnswerQuestionUseCase } from './answer-question.usecase'

describe('AnswerQuestionUseCase', () => {
  let sut: AnswerQuestionUseCase
  let answersRepo: AnswersRepository
  let usersRepo: UsersRepository
  let questionsRepo: QuestionsRepository
  const request = {
    questionId: 'any_question_id',
    content: 'any long answer, with more than 45 characters for an question',
  }

  beforeEach(() => {
    answersRepo = new InMemoryAnswersRepository()
    usersRepo = new InMemoryUsersRepository()
    questionsRepo = new InMemoryQuestionsRepository()
    sut = new AnswerQuestionUseCase(answersRepo, usersRepo, questionsRepo)
  })

  it('should not answer a question using an inexistent author', async () => {
    await expect(
      sut.execute({
        ...request,
        authorId: 'inexistent_user_id',
      })
    ).rejects.toThrow('User not found')
  })

  it('should correctly answer a question', async () => {
    const author = await usersRepo.create(makeUserData())
    const question = makeQuestionData({ id: request.questionId })
    await questionsRepo.create(question)

    const response = await sut.execute({ ...request, authorId: author.id })

    const answer = await answersRepo.findById(response.id)
    expect(response.id).toEqual(answer?.id)
    expect(response.content).toEqual(answer?.content)
    expect(response.authorId).toEqual(answer?.authorId)
    expect(response.questionId).toEqual(answer?.questionId)
    expect(response.createdAt).toEqual(answer?.createdAt)
    expect(response.updatedAt).toEqual(answer?.updatedAt)
    expect(response.excerpt).toEqual('any long answer, with more than 45 characters...')
  })
})
