import { uuidv7 } from 'uuidv7'
import { faker } from '@faker-js/faker'
import type { EmailValidation } from '@prisma/client'

export function makeEmailValidation (override: Partial<EmailValidation> = {}): EmailValidation {
  const futureDate = new Date()
  futureDate.setMinutes(futureDate.getMinutes() + 10)
  return {
    id: uuidv7(),
    email: faker.internet.email(),
    code: faker.string.uuid(),
    expiresAt: futureDate,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...override,
  }
}
