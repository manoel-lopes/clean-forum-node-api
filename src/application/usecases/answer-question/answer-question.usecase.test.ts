import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import {
  InMemoryAnswersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import {
  InMemoryUsersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { makeUser } from '@/util/factories/domain/make-user'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { AnswerQuestionUseCase } from './answer-question.usecase'

describe('AnswerQuestionUseCase', () => {
  let sut: AnswerQuestionUseCase
  let answersRepository: AnswersRepository
  let usersRepository: UsersRepository

  const request = {
    questionId: 'any_question_id',
    content: 'any_answer_content',
  }

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new AnswerQuestionUseCase(answersRepository, usersRepository)
  })

  it('should not answer a question using an inexistent author', async () => {
    await expect(sut.execute({
      ...request,
      authorId: 'inexistent_user_id',
    })).rejects.toThrowError(new ResourceNotFoundError('User'))
  })

  it('should correctly answer a question', async () => {
    const author = makeUser()
    await usersRepository.save(author)

    const answer = await sut.execute({ ...request, authorId: author.id })

    expect(answer.id).toBeDefined()
    expect(answer.content).toBe(request.content)
    expect(answer.authorId).toBe(author.id)
    expect(answer.questionId).toBe(request.questionId)
    expect(answer.createdAt).toBeInstanceOf(Date)

    const savedAnswer = await answersRepository.findById(answer.id)
    expect(savedAnswer).toEqual(answer)
  })
})
