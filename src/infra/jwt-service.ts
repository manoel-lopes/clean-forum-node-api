import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '@/lib/env'

export type DecodedToken = JwtPayload & {
  sub: string
}

export class JWTService {
  static sign (userId: string): string {
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set')
    }
    return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '1h' })
  }

  static verify (token: string) {
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set')
    }
    return jwt.verify(token, env.JWT_SECRET)
  }

  static decodeToken (token: string): DecodedToken {
    const decoded = this.verify(token)
    return decoded as DecodedToken
  }
}
