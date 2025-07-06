import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/main/fastify/app'

describe('Create Account Route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to create a new account', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(201)
  })
})
