import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { makeUser } from '@/shared/util/factories/domain/make-user'
import { createAndSave, expectEntityToMatch } from '@/shared/util/test/test-helpers'
import { CreateQuestionUseCase } from './create-question.usecase'
import { QuestionWithTitleAlreadyRegisteredError } from './errors/question-with-title-already-registered.error'

describe('CreateQuestionUseCase', () => {
  let sut: CreateQuestionUseCase
  let questionsRepository: QuestionsRepository
  let usersRepository: UsersRepository

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should not create a question with a title already registered', async () => {
    const author = await createAndSave(makeUser, usersRepository)
    const input = {
      title: 'Existing Question Title',
      content: 'Question content',
      authorId: author.id
    }
    await sut.execute(input)

    await expect(sut.execute(input)).rejects.toThrowError(
      new QuestionWithTitleAlreadyRegisteredError()
    )
  })

  it('should create an unanswered question', async () => {
    const author = await createAndSave(makeUser, usersRepository)
    const input = {
      title: 'New Question Title',
      content: 'Question content',
      authorId: author.id
    }

    await sut.execute(input)

    const question = await questionsRepository.findByTitle('New Question Title')
    expect(question).not.toBeNull()
    expectEntityToMatch(question!, {
      title: 'New Question Title',
      content: 'Question content',
      slug: 'new-question-title',
      authorId: author.id
    })
    expect(question?.bestAnswerId).toBeUndefined()
  })

  it('should create a question with a best answer', async () => {
    const author = await createAndSave(makeUser, usersRepository)
    const input = {
      title: 'Question With Answer',
      content: 'Question content',
      bestAnswerId: 'best-answer-id',
      authorId: author.id
    }

    await sut.execute(input)

    const question = await questionsRepository.findByTitle('Question With Answer')
    expect(question).not.toBeNull()
    expectEntityToMatch(question!, {
      title: 'Question With Answer',
      content: 'Question content',
      slug: 'question-with-answer',
      authorId: author.id,
      bestAnswerId: 'best-answer-id'
    })
  })
})
