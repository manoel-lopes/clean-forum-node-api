type Resource = 'User' | 'Answer' | 'Question' | 'Comment' | 'Comment' | 'Refresh token'

export class ResourceNotFoundError extends Error {
  constructor (resource: Resource) {
    super(`${resource} not found`)
  }
}
