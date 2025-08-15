import { type FastifyReply, type FastifyRequest } from 'fastify'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { extractToken } from '@/util/auth/extract-token'

export async function ensureAuthenticated (
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = extractToken(req.headers?.authorization)
    if (token === 'undefined') {
      return reply.code(401).send({ message: 'The token is missing' })
    }

    JWTService.verify(token)
    if (JWTService.isExpired(token)) {
      return reply.code(401).send({ message: 'The token is expired' })
    }
  } catch (error) {
    return reply.code(401).send({ message: error.message })
  }
}
