import { Slug } from '@domain/value-objects/slug/slug.vo'

export interface QuestionProps {
  title: string
  content: string
  slug: Slug
  authorId: string
  bestAnswerId?: string
  createdAt: Date
  updatedAt?: Date
}
