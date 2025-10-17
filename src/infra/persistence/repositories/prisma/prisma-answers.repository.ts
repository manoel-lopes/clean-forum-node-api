import type { AnswersRepository, UpdateAnswerData } from '@/domain/application/repositories/answers.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'

export class PrismaAnswersRepository implements AnswersRepository {
  async create(data: AnswerProps): Promise<Answer> {
    const answer = await prisma.answer.create({ data })
    return answer
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    })
    return answer
  }

  async delete(answerId: string): Promise<void> {
    await prisma.answer.delete({
      where: { id: answerId },
    })
  }

  async update({ where, data }: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await prisma.answer.update({ where, data })
    return updatedAnswer
  }
}
