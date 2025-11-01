import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  PaginatedQuestionAttachments,
  QuestionAttachmentsRepository,
} from '@/domain/application/repositories/question-attachments.repository'
import { PrismaQuestionAttachmentMapper } from '@/infra/persistence/mappers/prisma/prisma-question-attachment.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import { BasePrismaRepository } from '@/infra/persistence/repositories/prisma/base/base-prisma.repository'
import type {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/enterprise/entities/question-attachment.entity'

export class PrismaQuestionAttachmentsRepository extends BasePrismaRepository implements QuestionAttachmentsRepository {
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
    const pagination = this.sanitizePagination(page, pageSize)
    const [attachments, totalItems] = await prisma.$transaction([
      prisma.attachment.findMany({
        where: { questionId },
        orderBy: { createdAt: order },
        skip: pagination.skip,
        take: pagination.take,
      }),
      prisma.attachment.count({ where: { questionId } }),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
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
    await prisma.attachment.delete({ where: { id: attachmentId } })
  }

  async deleteMany (attachmentIds: string[]): Promise<void> {
    await prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    })
  }
}
