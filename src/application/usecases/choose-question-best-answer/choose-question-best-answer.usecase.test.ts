import { makeQuestion } from '@test/util/factories/domain/make-question'
import { makeAnswer } from '@test/util/factories/domain/make-answer'
import { InMemoryQuestionsRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryAnswersRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.usecase'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'
import { NotAuthorError } from '@application/errors/not-author.error'

describe('ChooseQuestionBestAnswerUseCase', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let answersRepository: InMemoryAnswersRepository
  let sut: ChooseQuestionBestAnswerUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository)
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id,
      authorId: question.authorId,
    })

    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose a non-existing answer as the question best answer', async () => {
    const question = makeQuestion()

    await questionsRepository.create(question)

    await expect(sut.execute({
      answerId: 'non-existing-id',
      authorId: question.authorId,
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to choose the question best answer from another author', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await questionsRepository.create(question)
    await answersRepository.create(answer)

    await expect(sut.execute({
      answerId: answer.id,
      authorId: 'another-author',
    })).rejects.toBeInstanceOf(NotAuthorError)
  })
})
