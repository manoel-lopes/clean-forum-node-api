import { Entity } from '@core/domain/entity'
import { QuestionProps } from './ports/question.props'
import { randomUUID } from 'node:crypto'
import { Slug } from '@domain/value-objects/slug/slug.vo'

export class Question extends Entity<QuestionProps> {
  private constructor(props: QuestionProps, id?: string) {
    super(props, id)
  }

  public static create(props: QuestionProps, id?: string): Question {
    const question = new Question({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.title),
      createdAt: props.createdAt ?? new Date(),
    }, id)

    if (!id) {
      question.id = randomUUID()
    }

    return question
  }

  public get title(): string {
    return this.props.title
  }

  public set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
  }

  public get content(): string {
    return this.props.content
  }

  public set content(content: string) {
    this.props.content = content
  }

  public get slug(): Slug {
    return this.props.slug
  }

  public get authorId(): string {
    return this.props.authorId
  }

  public get bestAnswerId(): string | undefined {
    return this.props.bestAnswerId
  }

  public set bestAnswerId(bestAnswerId: string | undefined) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
