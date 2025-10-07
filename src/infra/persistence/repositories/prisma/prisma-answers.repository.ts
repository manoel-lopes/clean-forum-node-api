import { uuidv7 } from 'uuidv7'
import type { AnswersRepository, UpdateAnswerData } from '@/domain/application/repositories/answers.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'

export class PrismaAnswersRepository implements AnswersRepository {
  async save (answer: AnswerProps): Promise<Answer> {
    const excerpt = answer.excerpt || answer.content.substring(0, 45).replace(/ $/, '').concat('...')
    const createdAnswer = await prisma.answer.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        content: answer.content,
        authorId: answer.authorId,
        questionId: answer.questionId,
        excerpt
      } as any
    })
    return createdAnswer as Answer
  }

  async findById (answerId: string): Promise<Answer | null> {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    })
    return answer as Answer | null
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

    return updatedAnswer as Answer
  }
}
