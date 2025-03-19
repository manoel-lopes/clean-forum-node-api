import type { UseCase } from '@/core/application/use-case'
import type {
  AnswersRepository,
  UpdateAnswerData
} from '@/application/repositories/answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { Rename } from '@/util/types/rename'

export type EditAnswerRequest = Rename<UpdateAnswerData, 'id', 'answerId'>

export class EditAnswerUseCase implements UseCase {
  constructor (private readonly answersRepository: AnswersRepository) {
    Object.freeze(this)
  }

  async execute (req: EditAnswerRequest): Promise<Answer> {
    const { answerId, content } = req
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }

    const editedAnswer = await this.answersRepository.update({
      id: answerId,
      content,
    })
    return editedAnswer
  }
}
