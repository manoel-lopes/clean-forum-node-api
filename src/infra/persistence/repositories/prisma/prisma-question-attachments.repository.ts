import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  PaginatedQuestionAttachments,
  QuestionAttachmentsRepository,
} from '@/domain/application/repositories/question-attachments.repository'
import { PrismaQuestionAttachmentMapper } from '@/infra/persistence/mappers/prisma/prisma-question-attachment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/enterprise/entities/question-attachment.entity'

export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  async create (data: QuestionAttachmentProps): Promise<QuestionAttachment> {
    const { url, ...rest } = data
    const attachment = await prisma.attachment.create({ data: { ...rest, link: url } })
    return PrismaQuestionAttachmentMapper.toDomain(attachment)
  }

  async createMany (attachments: QuestionAttachmentProps[]): Promise<QuestionAttachment[]> {
    const mappedData = attachments.map(({ url, ...rest }) => ({ ...rest, link: url }))
    const created = await prisma.attachment.createManyAndReturn({ data: mappedData })
    return created.map((attachment) => PrismaQuestionAttachmentMapper.toDomain(attachment))
  }

  async findById (attachmentId: string): Promise<QuestionAttachment | null> {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    })
    if (!attachment || !attachment.questionId) return null
    return PrismaQuestionAttachmentMapper.toDomain(attachment)
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionAttachments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const [attachments, totalItems] = await prisma.$transaction([
      prisma.attachment.findMany({
        where: { questionId },
        orderBy: { createdAt: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.attachment.count({ where: { questionId } }),
    ])
    return {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      items: attachments.map((attachment) => PrismaQuestionAttachmentMapper.toDomain(attachment)),
      order,
    }
  }

  async update (
    attachmentId: string,
    data: Partial<Pick<QuestionAttachment, 'title' | 'url'>>
  ): Promise<QuestionAttachment> {
    const { url, ...rest } = data
    const updateData = url ? { ...rest, link: url } : rest
    const updatedAttachment = await prisma.attachment.update({
      where: { id: attachmentId },
      data: updateData,
    })
    return PrismaQuestionAttachmentMapper.toDomain(updatedAttachment)
  }

  async delete (attachmentId: string): Promise<void> {
    try {
      await prisma.attachment.delete({ where: { id: attachmentId } })
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return
      }
      throw error
    }
  }

  async deleteMany (attachmentIds: string[]): Promise<void> {
    await prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    })
  }
}
