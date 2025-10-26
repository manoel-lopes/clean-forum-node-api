import type { AnswerWithIncludes } from '@/domain/application/repositories/answers.repository'
import type { QuestionWithIncludes } from '@/domain/application/repositories/questions.repository'
import type { AnswerAttachment } from '@/domain/enterprise/entities/answer-attachment.entity'
import type { AnswerComment } from '@/domain/enterprise/entities/answer-comment.entity'
import type { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment.entity'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'
import type { User } from '@/domain/enterprise/entities/user.entity'
import type { Answer, Attachment, Comment, Question } from '@prisma/client'

type PrismaQuestion = Question & {
  answers: (Answer & {
    author?: Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>
    comments?: Comment[] | false
    attachments?: Attachment[] | false
  })[]
  comments?: Comment[] | false
  attachments?: Attachment[] | false
  author?: Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'> | false
}

type PaginationData = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  order: 'asc' | 'desc'
}

type AuthorData = Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>

export class PrismaQuestionMapper {
  static toDomain (
    raw: PrismaQuestion,
    pagination: PaginationData
  ): QuestionWithIncludes {
    const { answers, comments, attachments, author, ...questionData } = raw
    const mappedAnswers = answers.map((answer) => this.mapAnswer(answer))
    const response: QuestionWithIncludes = {
      ...questionData,
      updatedAt: questionData.updatedAt || questionData.createdAt,
      answers: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        items: mappedAnswers,
        order: pagination.order,
      },
    }
    if (Array.isArray(comments)) {
      response.comments = this.mapQuestionComments(comments)
    }
    if (Array.isArray(attachments)) {
      response.attachments = this.mapQuestionAttachments(attachments)
    }
    if (author && typeof author === 'object') {
      response.author = this.mapAuthor(author)
    }
    return response
  }

  private static mapAnswer (answer: Answer & {
    author?: Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>
    comments?: Comment[] | false
    attachments?: Attachment[] | false
  }): AnswerWithIncludes {
    const { comments, attachments, author, ...answerData } = answer
    const mappedAnswer: AnswerWithIncludes = {
      ...answerData,
      updatedAt: answerData.updatedAt || answerData.createdAt,
    }
    if (Array.isArray(comments)) {
      mappedAnswer.comments = this.mapAnswerComments(comments)
    }
    if (Array.isArray(attachments)) {
      mappedAnswer.attachments = this.mapAnswerAttachments(attachments)
    }
    if (author && typeof author === 'object') {
      mappedAnswer.author = this.mapAuthor(author)
    }
    return mappedAnswer
  }

  private static mapQuestionComments (comments: Comment[]): QuestionComment[] {
    return comments.map((comment): QuestionComment => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      questionId: comment.questionId!,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt || comment.createdAt,
    }))
  }

  private static mapAnswerComments (comments: Comment[]): AnswerComment[] {
    return comments.map((comment): AnswerComment => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      answerId: comment.answerId!,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt || comment.createdAt,
    }))
  }

  private static mapQuestionAttachments (attachments: Attachment[]): QuestionAttachment[] {
    return attachments.map((attachment): QuestionAttachment => ({
      id: attachment.id,
      title: attachment.title,
      url: attachment.link,
      questionId: attachment.questionId!,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt || attachment.createdAt,
    }))
  }

  private static mapAnswerAttachments (attachments: Attachment[]): AnswerAttachment[] {
    return attachments.map((attachment): AnswerAttachment => ({
      id: attachment.id,
      title: attachment.title,
      url: attachment.link,
      answerId: attachment.answerId!,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt || attachment.createdAt,
    }))
  }

  private static mapAuthor (author: AuthorData): AuthorData {
    return {
      id: author.id,
      name: author.name,
      email: author.email,
      createdAt: author.createdAt,
      updatedAt: author.updatedAt,
    }
  }
}
