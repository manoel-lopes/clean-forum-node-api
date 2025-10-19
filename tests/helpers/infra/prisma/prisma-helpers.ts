import { PrismaClient } from '@prisma/client'

export class PrismaHelper {
  private static readonly prisma = new PrismaClient()

  static async getLastEmailCodeForEmail (email: string): Promise<string | undefined> {
    const emailValidation = await this.prisma.emailValidation.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })
    return emailValidation?.code
  }

  static async cleanup (): Promise<void> {
    await this.prisma.emailValidation.deleteMany()
  }
}
