import { FastifyInstance } from 'fastify'
import { makeCreateQuestionController } from '@main/factories/controllers/create-question'
import { makeAnswerQuestionController } from '@main/factories/controllers/answer-question'
import {
  makeChooseQuestionBestAnswerController
} from '@main/factories/controllers/choose-question-best-answer'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  createQuestionSchema,
  createQuestionResponsesSchema
} from '@external/zod/application/schemas/question/create-question.schema'
import { errorResponseSchema } from '@external/zod/application/schemas/core/error-response.schema'
import {
  answerQuestionSchema,
  answerQuestionResponsesSchema
} from '@external/zod/application/schemas/question/answer-question.schema'
import {
  chooseQuestionBestAnswerSchema,
  chooseQuestionBestAnswerResponsesSchema
} from '@external/zod/application/schemas/question/choose-question-best-answer.schema'

export async function questionRoutes (app: FastifyInstance): Promise<void> {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/questions',
    {
      schema: {
        tags: ['Question'],
        summary: 'Create a question',
        body: createQuestionSchema,
        response: {
          201: createQuestionResponsesSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await makeCreateQuestionController().handle({
        body: request.body,
        user: request.user,
      })

      return reply.status(201).send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/questions/:questionId/answers',
    {
      schema: {
        tags: ['Question'],
        summary: 'Answer a question',
        body: answerQuestionSchema,
        response: {
          201: answerQuestionResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      await makeAnswerQuestionController().handle({
        body: request.body,
        params: request.params,
        user: request.user,
      })

      return reply.status(201).send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().patch(
    '/answers/:answerId/best',
    {
      schema: {
        tags: ['Question'],
        summary: 'Choose question best answer',
        body: chooseQuestionBestAnswerSchema,
        response: {
          204: chooseQuestionBestAnswerResponsesSchema,
          403: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await makeChooseQuestionBestAnswerController().handle({
        params: request.params,
        user: request.user,
      })

      return reply.status(204).send()
    }
  )
}
