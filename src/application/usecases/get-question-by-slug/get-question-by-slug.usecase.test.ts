import { makeQuestion } from '@test/util/factories/domain/make-question'
import { InMemoryQuestionsRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug.usecase'

describe('GetQuestionBySlugUseCase', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: GetQuestionBySlugUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const question = makeQuestion({ title: 'New Question' })
    await questionsRepository.create(question)

    const { question: foundQuestion } = await sut.execute({
      slug: question.slug.value,
    })

    expect(foundQuestion.id).toEqual(question.id)
  })

  it('should not be able to get a non-existing question by slug', async () => {
    await expect(sut.execute({
      slug: 'non-existing-slug',
    })).rejects.toThrow('Question not found')
  })
})
