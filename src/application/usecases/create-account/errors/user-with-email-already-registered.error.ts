import { UseCaseError } from '@core/application/use-case'

export class UserWithEmailAlreadyRegisteredError extends Error implements UseCaseError {
  constructor() {
    super('User with this e-mail already registered')
    this.name = 'UserWithEmailAlreadyRegisteredError'
  }
}