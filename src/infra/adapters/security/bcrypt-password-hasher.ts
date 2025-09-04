import bcrypt from 'bcrypt'
import type { PasswordHasher } from './ports/password-hasher'

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = process.env.NODE_ENV === 'test' ? 4 : 12

  async hash (password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }
}
