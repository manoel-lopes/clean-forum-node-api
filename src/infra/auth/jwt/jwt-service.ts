import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '@/lib/env'
import { InvalidTokenError } from './errors/invalid-token.error'
import { SecretNotSetError } from './errors/secret-not-set.error'

export type DecodedToken = JwtPayload & {
  sub: string
}

export class JWTService {
  static sign (userId: string): string {
    if (!env.JWT_SECRET) {
      throw new SecretNotSetError()
    }
    return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '1h' })
  }

  static verify (token: string): DecodedToken | null {
    if (!env.JWT_SECRET) {
      throw new SecretNotSetError()
    }
    try {
      return jwt.verify(token, env.JWT_SECRET) as DecodedToken
    } catch {
      return null
    }
  }

  static decodeToken (token: string): DecodedToken {
    const decoded = this.verify(token)
    if (!decoded) {
      throw new InvalidTokenError()
    }
    return decoded as DecodedToken
  }

  static isExpired (token: string) {
    const decoded = this.decodeToken(token)
    return decoded.exp ? decoded.exp < Date.now() / 1000 : false
  }
}
