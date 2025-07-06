import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { makeAnswer } from '@/util/factories/domain/make-answer'
import { makeQuestion } from '@/util/factories/domain/make-question'

import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.usecase'

describe('ChooseQuestionBestAnswerUseCase', () => {
  let sut: ChooseQuestionBestAnswerUseCase
  let questionsRepository: QuestionsRepository
  let answersRepository: AnswersRepository

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository)
  })

  it('should not choose a nonexistent answer as the best answer', async () => {
    await expect(sut.execute({
      answerId: 'non_existent_answer_id',
      authorId: 'any_author_id'
    })).rejects.toThrow(new ResourceNotFoundError('Answer'))
  })

  it('should not choose the best answer for a nonexistent question', async () => {
    const answer = makeAnswer({ questionId: 'non_existent_question_id' })
    await answersRepository.save(answer)

    await expect(sut.execute({
      answerId: answer.id,
      authorId: 'any_author_id'
    })).rejects.toThrow(new ResourceNotFoundError('Question'))
  })

  it('should not choose the best answer for a question not owned by the author', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.save(answer)

    await expect(sut.execute({
      answerId: answer.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrow(new NotAuthorError('question'))
  })

  it('should not choose the best answer for a question with no answers', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    await expect(sut.execute({
      answerId: 'non_existent_answer_id',
      authorId: question.authorId
    })).rejects.toThrow(new ResourceNotFoundError('Answer'))
  })

  it('should be able to choose the best answer for a question', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.save(answer)

    const response = await sut.execute({
      answerId: answer.id,
      authorId: question.authorId
    })

    expect(response.id).toBe(question.id)
    expect(response.content).toBe(question.content)
    expect(response.title).toBe(question.title)
    expect(response.authorId).toBe(question.authorId)
    expect(response.slug).toBe(question.slug)
    expect(response.createdAt).toBeInstanceOf(Date)
    expect(response.updatedAt).toBeInstanceOf(Date)
    expect(response.bestAnswerId).toBe(answer.id)
  })

  it('should persist the question with the best answer id', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    const answer = makeAnswer({ questionId: question.id })
    await answersRepository.save(answer)

    const saveSpy = vi.spyOn(questionsRepository, 'update')

    await sut.execute({
      answerId: answer.id,
      authorId: question.authorId
    })

    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
      bestAnswerId: answer.id
    }))
  })
})
