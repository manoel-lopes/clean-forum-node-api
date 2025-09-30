import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { deleteUser } from '../helpers/entities/user-helpers'
import { app } from '../helpers/infrastructure/test-app'

describe('Delete Account', () => {
  let token: string

  beforeAll(async () => {
    token = await makeAuthToken(app)
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
