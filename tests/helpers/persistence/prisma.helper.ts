import { prisma } from '@/infra/persistence/prisma/client'

export class PrismaHelper {
  static async cleanDatabase () {
    try {
      await prisma.comment.deleteMany()
    } catch (error) {
      console.error('Error deleting comments:', error)
    }
    try {
      await prisma.answer.deleteMany()
    } catch (error) {
      console.error('Error deleting answers:', error)
    }
    try {
      await prisma.question.deleteMany()
    } catch (error) {
      console.error('Error deleting questions:', error)
    }
    try {
      await prisma.refreshToken.deleteMany()
    } catch (error) {
      console.error('Error deleting refresh tokens:', error)
    }
    try {
      await prisma.user.deleteMany()
    } catch (error) {
      console.error('Error deleting users:', error)
    }
  }
}
