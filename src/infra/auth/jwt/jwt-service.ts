import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '@/lib/env'
import { SecretNotSetError } from './errors/secret-not-set.error'

export type DecodedToken = JwtPayload & {
  sub: string
}

function isDecodedToken (decoded: unknown): decoded is DecodedToken {
  if (typeof decoded !== 'object' || decoded === null || !('sub' in decoded)) {
    return false
  }
  return typeof decoded.sub === 'string'
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
      const decoded = jwt.verify(token, env.JWT_SECRET)
      if (isDecodedToken(decoded)) {
        return decoded
      }
      return null
    } catch {
      return null
    }
  }

  static decodeToken (token: string): DecodedToken {
    const decoded = this.verify(token)
    if (!decoded) {
      throw new Error('Decoded token is null')
    }
    return decoded
  }

  static isExpired (token: string) {
    const decoded = this.decodeToken(token)
    return decoded.exp ? decoded.exp < Date.now() / 1000 : false
  }
}
