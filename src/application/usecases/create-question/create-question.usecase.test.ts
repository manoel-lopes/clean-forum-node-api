import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { CreateQuestionUseCase } from './create-question.usecase'
import { QuestionWithTitleAlreadyRegisteredError } from './errors/question-with-title-already-registered.error'
import { makeUser } from '@/shared/util/factories/domain/make-user'

describe('CreateQuestionUseCase', () => {
  let sut: CreateQuestionUseCase
  let questionsRepository: QuestionsRepository
  let usersRepository: UsersRepository
  const request = {
    title: 'any_question_title',
    content: 'any_question_content'
  }

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should not create a question with a title already registered', async () => {
    const author = makeUser()
    await usersRepository.save(author)
    await sut.execute({ ...request, authorId: author.id })

    await expect(sut.execute({
      ...request, authorId: author.id
    })).rejects.toThrowError(new QuestionWithTitleAlreadyRegisteredError())
  })

  it('should create an unanswered question', async () => {
    const author = makeUser()
    await usersRepository.save(author)

    const question = await sut.execute({ ...request, authorId: author.id })

    expect(question.id).toBeDefined()
    expect(question.content).toBe('any_question_content')
    expect(question.title).toBe('any_question_title')
    expect(question.slug).toBe('any-question-title')
    expect(question.authorId).toBe(author.id)
    expect(question.bestAnswerId).toBeUndefined()
    expect(question.createdAt).toBeInstanceOf(Date)
    expect(question.updatedAt).toBeInstanceOf(Date)
  })

  it('should create a question with a best answer', async () => {
    const author = makeUser()
    await usersRepository.save(author)

    const question = await sut.execute({
      ...request,
      bestAnswerId: 'any_best_answer_id',
      authorId: author.id
    })

    expect(question.id).toBeDefined()
    expect(question.content).toBe('any_question_content')
    expect(question.title).toBe('any_question_title')
    expect(question.authorId).toBe(author.id)
    expect(question.bestAnswerId).toBe('any_best_answer_id')
    expect(question.createdAt).toBeInstanceOf(Date)
    expect(question.updatedAt).toBeInstanceOf(Date)
    expect(question.slug).toBe('any-question-title')
  })
})
