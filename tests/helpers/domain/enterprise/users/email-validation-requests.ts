import { PrismaEmailCodeHelper } from 'tests/helpers/infra/database/prisma-email-code.helper'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

type VerifyEmailValidationData = {
  email?: unknown
  code?: unknown
}

export async function sendEmailValidation (app: FastifyInstance, { email }: { email: unknown }) {
  return await request(app.server).post('/users/send-email-validation').send({ email })
}

export async function verifyEmailValidation (app: FastifyInstance, data: VerifyEmailValidationData) {
  return await request(app.server).post('/users/verify-email-validation').send(data)
}

export async function getLastEmailCodeForEmail (email: unknown): Promise<string | undefined> {
  return PrismaEmailCodeHelper.getLastEmailCodeForEmail(String(email))
}

export async function clearEmailCodes () {
  await PrismaEmailCodeHelper.cleanup()
}
