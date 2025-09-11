import type { FastifyInstance } from 'fastify'
import { createTestApp } from '../helpers/app-factory'
import { makeAuthToken } from '../helpers/make-auth-token'
import { deleteUser } from '../helpers/user-helpers'

describe('Delete Account', () => {
  let app: FastifyInstance
  let token: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
    token = await makeAuthToken(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await deleteUser(app, '')

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 204 on successful account deletion', async () => {
    const httpResponse = await deleteUser(app, token)

    expect(httpResponse.statusCode).toBe(204)
  })
})
