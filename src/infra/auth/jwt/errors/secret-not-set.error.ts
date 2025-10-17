export class SecretNotSetError extends Error {
  constructor() {
    super('JWT_SECRET is not set')
  }
}
