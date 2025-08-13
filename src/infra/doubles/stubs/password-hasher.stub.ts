import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'

export class PasswordHasherStub implements PasswordHasher {
  async hash (password: string): Promise<string> {
    return password
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return password === hashedPassword
  }
}
