import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer, deleteAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

describe('Delete Answer Cascade', () => {
  it('should delete answer and cascade delete attachments and comments', async () => {
    const authToken = await makeAuthToken(app)
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    const answerData = anAnswer().build()
    const answerResponse = await createAnswer(app, authToken, {
      questionId: createdQuestion.id,
      content: answerData.content
    })
    const answerId = answerResponse.body.id

    const attachmentResponse = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/attachments`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: { title: 'Answer Doc', link: 'https://example.com/answer.pdf' }
    })
    const attachmentId = attachmentResponse.json().id

    const commentResponse = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/comments`,
      headers: { authorization: `Bearer ${authToken}` },
      payload: { content: 'Answer comment' }
    })
    const commentId = commentResponse.json().id

    const deleteResponse = await deleteAnswer(app, authToken, { answerId })
    expect(deleteResponse.statusCode).toBe(204)

    const checkAttachmentResponse = await app.inject({
      method: 'DELETE',
      url: `/answers/attachments/${attachmentId}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkAttachmentResponse.statusCode).toBe(404)

    const checkCommentResponse = await app.inject({
      method: 'DELETE',
      url: `/comments/${commentId}`,
      headers: { authorization: `Bearer ${authToken}` }
    })
    expect(checkCommentResponse.statusCode).toBe(404)
  })
})
