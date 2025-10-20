import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { makeUser } from '@/shared/util/factories/domain/make-user'
import { AnswerQuestionUseCase } from './answer-question.usecase'

describe('AnswerQuestionUseCase', () => {
  let sut: AnswerQuestionUseCase
  let answersRepository: AnswersRepository
  let usersRepository: UsersRepository
  let questionsRepository: QuestionsRepository
  const request = {
    questionId: 'any_question_id',
    content: 'any long answer, with more than 45 characters for an question',
  }

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    usersRepository = new InMemoryUsersRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new AnswerQuestionUseCase(answersRepository, usersRepository, questionsRepository)
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
    const author = makeUser()
    await usersRepository.create(author)
    const question = makeQuestion({ id: request.questionId })
    await questionsRepository.create(question)

    const answer = await sut.execute({ ...request, authorId: author.id })

    expect(answer.id).toBeDefined()
    expect(answer.content).toBe(request.content)
    expect(answer.authorId).toBe(author.id)
    expect(answer.questionId).toBe(request.questionId)
    expect(answer.createdAt).toBeInstanceOf(Date)
    expect(answer.updatedAt).toBeInstanceOf(Date)
    expect(answer.excerpt).toBe('any long answer, with more than 45 characters...')
    const savedAnswer = await answersRepository.findById(answer.id)
    expect(savedAnswer).toEqual(answer)
  })
})
