type Resource = 'User' | 'Answer' | 'Question' | 'Comment'
export class ResourceNotFoundError extends Error {
  constructor (resource: Resource) {
    super(`${resource} not found`)
  }
}
