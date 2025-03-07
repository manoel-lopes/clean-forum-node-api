type Resource = 'Question' | 'Answer' | 'User' | 'Answer comment' | 'Question comment'

export class ResourceNotFoundError extends Error {
  constructor (resource: Resource) {
    super(`${resource} not found`)
    this.name = 'ResourceNotFoundError'
  }
}
