import { UseCaseError } from '@core/application/use-case'

export class InvalidPasswordError extends Error implements UseCaseError {
  constructor() {
    super('Invalid password')
    this.name = 'InvalidPasswordError'
  }
}
