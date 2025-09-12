import { aUser } from 'tests/builders/user.builder'
import type { FastifyInstance } from 'fastify'
import { authenticateUser } from './session-helpers'
import { createUser } from './user-helpers'

export async function makeAuthToken (app: FastifyInstance) {
  const userData = aUser().build()
  await createUser(app, userData)
  const authResponse = await authenticateUser(app, {
    email: userData.email,
    password: userData.password,
  })
  return authResponse.body.token
}
