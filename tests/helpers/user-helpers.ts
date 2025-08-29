import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export function generateUniqueUserData (namePrefix = 'User'): CreateUserData {
  return {
    name: namePrefix,
    email: `${namePrefix.toLowerCase().replace(/\s+/g, '.')}.${uuidv7()}@example.com`,
    password: 'P@ssword123'
  }
}

export async function createUser (app: FastifyInstance, userData: CreateUserData) {
  const response = await request(app.server)
    .post('/users')
    .send(userData)

  return response
}

type AuthCredentials = {
  email: string
  password: string
}

export async function authenticateUser (app: FastifyInstance, credentials: AuthCredentials) {
  const response = await request(app.server)
    .post('/auth')
    .send(credentials)

  return response
}
