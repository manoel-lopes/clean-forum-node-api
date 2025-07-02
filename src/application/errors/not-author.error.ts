import { UseCaseError } from '@core/application/use-case'

export class NotAuthorError extends Error implements UseCaseError {
  constructor(resource: string) {
    super(`Not author of ${resource}`)
    this.name = 'NotAuthorError'
  }
}
