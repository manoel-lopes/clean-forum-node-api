import { hash, compare } from 'bcryptjs'
import type { PasswordHasher } from '../ports/password-hasher'

export class BcryptAdapter implements PasswordHasher {
  constructor (private readonly salt = 10) {}

  async hash (password: string): Promise<string> {
    return hash(password, this.salt)
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
