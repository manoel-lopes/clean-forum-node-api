/* eslint-disable @typescript-eslint/consistent-type-assertions */
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '@/lib/env'
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
    try {
      const decoded = this.verify(token)
      if (!decoded) {
        throw new Error('Decoded token is null')
      }
      return decoded as DecodedToken
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static isExpired (token: string) {
    const decoded = this.decodeToken(token)
    return decoded.exp ? decoded.exp < Date.now() / 1000 : false
  }
}
