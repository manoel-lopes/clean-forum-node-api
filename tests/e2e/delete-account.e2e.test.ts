import { app } from '@/main/server'
import { makeAuthToken } from '../factories/infra/make-auth-token'
import { deleteUser } from '../helpers/domain/enterprise/users/user-requests'

describe('Delete Account', () => {
  it('should return 401 and an error response if the user is not authenticated', async () => {
    const invalidToken = ''

    const httpResponse = await deleteUser(app, invalidToken)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 204 on successful account deletion', async () => {
    const authToken = await makeAuthToken(app)

    const httpResponse = await deleteUser(app, authToken)

    expect(httpResponse.statusCode).toBe(204)
  })
})
