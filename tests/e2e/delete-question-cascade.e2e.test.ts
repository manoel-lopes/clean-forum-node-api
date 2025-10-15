import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, deleteQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

describe('Delete Question Cascade', () => {
  it('should delete question and cascade delete answers, comments and attachments', async () => {
    const authToken = await makeAuthToken(app)
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    const attachmentResponse = await app.inject({
      method: 'POST',
      url: `/questions/${createdQuestion.id}/attachments`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: { title: 'Question Doc', link: 'https://example.com/question.pdf' }
    })
    const questionAttachmentId = attachmentResponse.json().id

    const commentResponse = await app.inject({
      method: 'POST',
      url: `/questions/${createdQuestion.id}/comments`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: { content: 'Question comment' }
    })
    const questionCommentId = commentResponse.json().id

    const answerData = anAnswer().build()
    const answerResponse = await createAnswer(app, authToken, {
      questionId: createdQuestion.id,
      content: answerData.content
    })
    const answerId = answerResponse.body.id

    const answerAttachmentResponse = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/attachments`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: { title: 'Answer Doc', link: 'https://example.com/answer.pdf' }
    })
    const answerAttachmentId = answerAttachmentResponse.json().id

    const answerCommentResponse = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/comments`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: { content: 'Answer comment' }
    })
    const answerCommentId = answerCommentResponse.json().id

    const deleteResponse = await deleteQuestion(app, authToken, { questionId: createdQuestion.id })
    expect(deleteResponse.statusCode).toBe(204)

    const checkQuestionResponse = await app.inject({
      method: 'GET',
      url: `/questions/${createdQuestion.slug}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkQuestionResponse.statusCode).toBe(404)

    const checkQuestionAttachmentResponse = await app.inject({
      method: 'DELETE',
      url: `/questions/attachments/${questionAttachmentId}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkQuestionAttachmentResponse.statusCode).toBe(404)

    const checkQuestionCommentResponse = await app.inject({
      method: 'DELETE',
      url: `/comments/${questionCommentId}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkQuestionCommentResponse.statusCode).toBe(404)

    const checkAnswerAttachmentResponse = await app.inject({
      method: 'DELETE',
      url: `/answers/attachments/${answerAttachmentId}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkAnswerAttachmentResponse.statusCode).toBe(404)

    const checkAnswerCommentResponse = await app.inject({
      method: 'DELETE',
      url: `/comments/${answerCommentId}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkAnswerCommentResponse.statusCode).toBe(404)
  })
})
