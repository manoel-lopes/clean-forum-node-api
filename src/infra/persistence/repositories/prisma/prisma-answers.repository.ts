import type { AnswersRepository, UpdateAnswerData } from '@/application/repositories/answers.repository'
import { PrismaAnswerMapper } from '@/infra/persistence/mappers/prisma/prisma-answer.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Answer } from '@/domain/entities/answer/answer.entity'

export class PrismaAnswersRepository implements AnswersRepository {
  async save (answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer)
    await prisma.answer.create({ data })
  }

  async findById (answerId: string): Promise<Answer | null> {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    })
    return !answer ? null : PrismaAnswerMapper.toDomain(answer)
  }

  async delete (answerId: string): Promise<void> {
    await prisma.answer.delete({
      where: { id: answerId },
    })
  }

  async update ({ data, where }: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await prisma.answer.update({
      where: {
        id: where.id,
      },
      data: {
        content: data.content,
      },
    })

    return PrismaAnswerMapper.toDomain(updatedAnswer)
  }
}
