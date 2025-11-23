import { aUser } from 'tests/builders/user.builder'
import type { FastifyInstance } from 'fastify'
import { createUser } from '../../helpers/domain/enterprise/users/user-requests'
import { authenticateUser } from '../../helpers/infra/auth/authentication-requests'

export async function makeAuthToken (app: FastifyInstance) {
  const userData = aUser().build()
  await createUser(app, userData)
  const authResponse = await authenticateUser(app, {
    email: userData.email,
    password: userData.password,
  })
  return authResponse.body.token
}
