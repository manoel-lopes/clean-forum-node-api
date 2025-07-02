import { PasswordHasher } from '../ports/password-hasher'

export class PasswordHasherStub implements PasswordHasher {
  public async hash(password: string): Promise<string> {
    return `${password}-hashed`
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return `${password}-hashed` === hash
  }
}