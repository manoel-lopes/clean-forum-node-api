/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { Attachment } from '@/domain/enterprise/entities/base/attachment.entity'
import type { Props } from '@/shared/types/custom/props'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAttachmentsRepository<T extends Attachment = Attachment>
  extends BaseRepository<T> {
  async createMany (attachments: Partial<T>[]): Promise<T[]> {
    const createdAttachments = await Promise.all(
      attachments.map(attachment => this.create(attachment as Props<T>))
    )
    return createdAttachments
  }

  async update (attachmentId: string, data: Partial<Pick<T, 'title' | 'link'>>): Promise<T> {
    const updatedAttachment = await this.updateOne({
      where: { id: attachmentId },
      data
    })
    return updatedAttachment
  }

  async deleteMany (attachmentIds: string[]): Promise<void> {
    this.items = this.items.filter(item => !attachmentIds.includes(item.id))
  }
}
