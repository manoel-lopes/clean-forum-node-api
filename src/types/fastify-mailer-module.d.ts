declare module 'fastify-mailer' {
  import { FastifyPluginAsync } from 'fastify'

  interface FastifyMailerOptions {
    defaults?: {
      from?: string
    }
    transport?: unknown
  }

  const fastifyMailer: FastifyPluginAsync<FastifyMailerOptions>
  export = fastifyMailer
}
