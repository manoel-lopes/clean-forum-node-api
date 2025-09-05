import nodemailer from 'nodemailer'
import type { FastifyInstance } from 'fastify'
import fastifyMailer from 'fastify-mailer'
import fastifyPlugin from 'fastify-plugin'
import { env } from '@/lib/env'

export const mailerPlugin = fastifyPlugin(
  async function (fastify: FastifyInstance) {
    let transportConfig

    if (env.EMAIL_HOST) {
      // Use provided SMTP configuration
      transportConfig = {
        host: env.EMAIL_HOST,
        port: env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS
        }
      }
    } else if (env.NODE_ENV === 'test') {
      // Use stream transport for testing to avoid SMTP issues
      transportConfig = {
        streamTransport: true,
        newline: 'windows',
        buffer: true
      }
    } else if (env.NODE_ENV === 'development') {
      // Use Ethereal Email for development (auto-generates credentials)
      const testAccount = await nodemailer.createTestAccount()
      transportConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      }
    } else {
      // Fallback to stream transport
      transportConfig = {
        streamTransport: true,
        newline: 'windows',
        buffer: true
      }
    }

    await fastify.register(fastifyMailer, {
      defaults: {
        from: env.EMAIL_FROM || 'noreply@cleanforum.com'
      },
      transport: transportConfig
    })
  }
)
