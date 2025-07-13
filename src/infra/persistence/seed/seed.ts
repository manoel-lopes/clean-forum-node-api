import { PrismaUserMapper } from '@/infra/persistence/mappers/prisma/prisma-user.mapper'
import { makeUser } from '@/util/factories/domain/make-user'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const users = Array.from({ length: 100 }).map(() => {
    return PrismaUserMapper.toPrisma(makeUser())
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
