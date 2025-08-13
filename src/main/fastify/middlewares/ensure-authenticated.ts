import { type FastifyReply, type FastifyRequest } from 'fastify'
import { JWTService } from '@/infra/jwt-service'

export async function ensureAuthenticated (
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authToken = request.headers.authorization
  if (!authToken) {
    return reply.code(401).send({ message: 'Token is missing' })
  }

  const [, token] = authToken.split(' ')
  if (JWTService.isExpired(token)) {
    return reply.code(401).send({ message: 'Token expired' })
  }

  try {
    JWTService.verify(token)
  } catch {
    return reply.code(401).send({ message: 'Token invalid' })
  }
}
