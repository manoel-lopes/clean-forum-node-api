import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

import { User } from '../src/domain/entities/user/user.entity'
import { PrismaUserMapper } from '../src/infra/persistence/mappers/prisma/prisma-user.mapper'

const prisma = new PrismaClient()

async function main() {
  const users = Array.from({ length: 100 }).map(() => {
    const user = User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
    return PrismaUserMapper.toPrisma(user)
  })

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })