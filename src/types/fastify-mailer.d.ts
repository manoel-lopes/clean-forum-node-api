import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    mailer: {
      sendMail(options: { to: string; subject: string; html?: string; text?: string; from?: string }): Promise<void>
    }
  }
}
