import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { AnswerAttachmentsRepository, PaginatedAnswerAttachments } from '@/domain/application/repositories/answer-attachments.repository'
import { PrismaAnswerAttachmentMapper } from '@/infra/persistence/mappers/prisma/prisma-answer-attachment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { AnswerAttachment, AnswerAttachmentProps } from '@/domain/enterprise/entities/answer-attachment.entity'

export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  async create (data: AnswerAttachmentProps): Promise<AnswerAttachment> {
    const attachment = await prisma.attachment.create({ data })
    return PrismaAnswerAttachmentMapper.toDomain(attachment)
  }

  async createMany (attachments: AnswerAttachmentProps[]): Promise<AnswerAttachment[]> {
    const created = await prisma.attachment.createManyAndReturn({ data: attachments })
    return created.map(attachment => PrismaAnswerAttachmentMapper.toDomain(attachment))
  }

  async findById (attachmentId: string): Promise<AnswerAttachment | null> {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId }
    })
    if (!attachment || !attachment.answerId) return null
    return PrismaAnswerAttachmentMapper.toDomain(attachment)
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerAttachments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const [attachments, totalItems] = await prisma.$transaction([
      prisma.attachment.findMany({
        where: { answerId },
        orderBy: { createdAt: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.attachment.count({ where: { answerId } })
    ])
    return {
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      items: attachments.map(attachment => PrismaAnswerAttachmentMapper.toDomain(attachment)),
      order
    }
  }

  async update (attachmentId: string, data: Partial<Pick<AnswerAttachment, 'title' | 'link'>>): Promise<AnswerAttachment> {
    const updatedAttachment = await prisma.attachment.update({
      where: { id: attachmentId },
      data
    })
    return PrismaAnswerAttachmentMapper.toDomain(updatedAttachment)
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
      where: { id: { in: attachmentIds } }
    })
  }
}
