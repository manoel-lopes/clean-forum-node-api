import { type FastifyReply, type FastifyRequest } from 'fastify'
import { JWTService } from '@/infra/auth/jwt/jwt-service'

export async function ensureAuthenticated (
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authToken = request.headers.authorization
    const [, token] = authToken?.split(' ') ?? ''
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
