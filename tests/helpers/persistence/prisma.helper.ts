import { prisma } from '@/infra/persistence/prisma/client'

export class PrismaHelper {
  static async cleanDatabase () {
    await prisma.comment.deleteMany()
    await prisma.answer.deleteMany()
    await prisma.question.deleteMany()
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany()
  }
}
