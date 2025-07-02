import { InMemoryAnswersRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { AnswerQuestionUseCase } from './answer-question.usecase'

describe('AnswerQuestionUseCase', () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const { answer } = await sut.execute({
      content: 'New Answer',
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(answer.id).toEqual(expect.any(String))
    expect(answersRepository.items[0].id).toEqual(answer.id)
  })
})
