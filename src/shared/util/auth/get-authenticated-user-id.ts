import type { HttpRequest } from '@/core/presentation/http'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { extractToken } from './extract-token'

export function getAuthenticatedUserId (req: HttpRequest): string {
  const token = extractToken(req.headers?.authorization)
  const { sub: userId } = JWTService.decodeToken(token)
  return userId
}
