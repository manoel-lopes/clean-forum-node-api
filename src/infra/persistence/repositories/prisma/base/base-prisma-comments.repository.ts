import { prisma } from '@/infra/persistence/prisma/client'

export abstract class BasePrismaCommentsRepository {
  async delete (commentId: string): Promise<void> {
    await prisma.comment.delete({ where: { id: commentId } })
  }
}
