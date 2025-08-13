import type { JWTService } from '@/infra/jwt-service'

export class JWTServiceStub implements JWTService {
  sign (): string {
    return 'any_token'
  }

  isExpired (): boolean {
    return false
  }

  decodeToken (): { sub: string } {
    return { sub: 'any_id' }
  }
}
