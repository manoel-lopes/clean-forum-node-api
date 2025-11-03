import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  AnswerAttachmentsRepository,
  PaginatedAnswerAttachments,
} from '@/domain/application/repositories/answer-attachments.repository'
import { PrismaAnswerAttachmentMapper } from '@/infra/persistence/mappers/prisma/prisma-answer-attachment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import { BasePrismaRepository } from '@/infra/persistence/repositories/prisma/base/base-prisma.repository'
import type { AnswerAttachment, AnswerAttachmentProps } from '@/domain/enterprise/entities/answer-attachment.entity'

export class PrismaAnswerAttachmentsRepository extends BasePrismaRepository implements AnswerAttachmentsRepository {
  async create (data: AnswerAttachmentProps): Promise<AnswerAttachment> {
    const { url, ...rest } = data
    const attachment = await prisma.attachment.create({ data: { ...rest, link: url } })
    return PrismaAnswerAttachmentMapper.toDomain(attachment)
  }

  async createMany (attachments: AnswerAttachmentProps[]): Promise<AnswerAttachment[]> {
    const mappedData = attachments.map(({ url, ...rest }) => ({ ...rest, link: url }))
    const created = await prisma.attachment.createManyAndReturn({ data: mappedData })
    return created.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async findById (attachmentId: string): Promise<AnswerAttachment | null> {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    })
    if (!attachment || !attachment.answerId) return null
    return PrismaAnswerAttachmentMapper.toDomain(attachment)
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerAttachments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const pagination = this.sanitizePagination(page, pageSize)
    const [attachments, totalItems] = await prisma.$transaction([
      prisma.attachment.findMany({
        where: { answerId },
        orderBy: { createdAt: order },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.attachment.count({ where: { answerId } }),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
      items: attachments.map(PrismaAnswerAttachmentMapper.toDomain),
      order,
    }
  }

  async update (
    attachmentId: string,
    data: Partial<Pick<AnswerAttachment, 'title' | 'url'>>
  ): Promise<AnswerAttachment> {
    const { url, ...rest } = data
    const updateData = url ? { ...rest, link: url } : rest
    const updatedAttachment = await prisma.attachment.update({
      where: { id: attachmentId },
      data: updateData,
    })
    return PrismaAnswerAttachmentMapper.toDomain(updatedAttachment)
  }

  async delete (attachmentId: string) {
    await prisma.attachment.delete({ where: { id: attachmentId } })
  }

  async deleteMany (attachmentIds: string[]) {
    await prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    })
  }
}
