import { type FastifyReply, type FastifyRequest } from 'fastify'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { extractToken } from '@/shared/util/auth/extract-token'

export async function ensureAuthenticated (req: FastifyRequest, reply: FastifyReply) {
  const errorResponse = {
    error: 'Unauthorized',
    message: 'Invalid token',
  }
  try {
    const token = extractToken(req.headers?.authorization)
    if (!token || token === 'undefined') {
      return reply.code(401).send(errorResponse)
    }
    const decodedToken = JWTService.verify(token)
    if (!decodedToken) {
      return reply.code(401).send(errorResponse)
    }
  } catch {
    return reply.code(401).send(errorResponse)
  }
}
