import { UseCaseError } from '@core/application/use-case'

export class QuestionWithTitleAlreadyRegisteredError extends Error implements UseCaseError {
  constructor() {
    super('Question with this title already registered')
    this.name = 'QuestionWithTitleAlreadyRegisteredError'
  }
}
