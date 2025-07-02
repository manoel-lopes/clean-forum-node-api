import { UseCase } from '@core/application/use-case'
import { AnswersRepository } from '@application/repositories/answers.repository'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'
import { NotAuthorError } from '@application/errors/not-author.error'

interface DeleteAnswerRequest {
  answerId: string
  authorId: string
}

type DeleteAnswerResponse = void

export class DeleteAnswerUseCase implements UseCase<DeleteAnswerRequest, DeleteAnswerResponse> {
  constructor(
    private answersRepository: AnswersRepository,
  ) {}

  public async execute({ answerId, authorId }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new ResourceNotFoundError(`Answer with ID "${answerId}" not found.`)
    }

    if (answer.authorId !== authorId) {
      throw new NotAuthorError('Answer')
    }

    await this.answersRepository.delete(answerId)
  }
}
