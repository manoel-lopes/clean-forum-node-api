import { Entity } from '@core/domain/entity'
import { AnswerProps } from './ports/answer.props'
import { randomUUID } from 'node:crypto'

export class Answer extends Entity<AnswerProps> {
  private constructor(props: AnswerProps, id?: string) {
    super(props, id)
  }

  public static create(props: AnswerProps, id?: string): Answer {
    const answer = new Answer({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id)

    if (!id) {
      answer.id = randomUUID()
    }

    return answer
  }

  public get content(): string {
    return this.props.content
  }

  public set content(content: string) {
    this.props.content = content
  }

  public get authorId(): string {
    return this.props.authorId
  }

  public get questionId(): string {
    return this.props.questionId
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
