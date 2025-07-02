import { makeQuestion } from '@test/util/factories/domain/make-question'
import { InMemoryQuestionsRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { CreateQuestionUseCase } from './create-question.usecase'
import { QuestionWithTitleAlreadyRegisteredError } from './errors/question-with-title-already-registered.error'

describe('CreateQuestionUseCase', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: CreateQuestionUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a new question', async () => {
    const { question } = await sut.execute({
      title: 'New Question',
      content: 'Question Content',
      authorId: 'author-1',
    })

    expect(question.id).toEqual(expect.any(String))
    expect(questionsRepository.items[0].id).toEqual(question.id)
  })

  it('should not be able to create a new question with same title', async () => {
    const question = makeQuestion({ title: 'New Question' })
    await questionsRepository.create(question)

    await expect(sut.execute({
      title: 'New Question',
      content: 'Question Content',
      authorId: 'author-1',
    })).rejects.toBeInstanceOf(QuestionWithTitleAlreadyRegisteredError)
  })
})
