import nodemailer from 'nodemailer'
import type { FastifyInstance } from 'fastify'
import fastifyMailer from 'fastify-mailer'
import fastifyPlugin from 'fastify-plugin'
import { env } from '@/lib/env'

type TransportConfig = {
  streamTransport?: boolean
  newline?: string
  buffer?: boolean
  host?: string
  port?: number
  secure?: boolean
  auth?: {
    user: string
    pass: string
  }
}

type MailerConfig = {
  defaults: {
    from: string
  }
  transport: TransportConfig
}

const createStreamTransport = (): TransportConfig => ({
  streamTransport: true,
  newline: 'windows',
  buffer: true
})

const createSMTPTransport = (host: string, port: number, user: string, pass: string): TransportConfig => ({
  host,
  port,
  secure: false,
  auth: { user, pass }
})

const createTestTransport = async (): Promise<TransportConfig> => {
  const testAccount = await nodemailer.createTestAccount()
  return createSMTPTransport('smtp.ethereal.email', 587, testAccount.user, testAccount.pass)
}

const transportStrategies: Record<string, () => Promise<TransportConfig>> = {
  test: async () => createStreamTransport(),
  smtp: async () => createSMTPTransport(
    env.EMAIL_HOST!,
    env.EMAIL_PORT || 587,
    env.EMAIL_USER!,
    env.EMAIL_PASS!
  ),
  ethereal: async () => createTestTransport(),
  fallback: async () => createStreamTransport()
}

const strategyRules: Array<{
  condition: () => boolean
  strategy: keyof typeof transportStrategies
}> = [
  { condition: () => env.NODE_ENV === 'test', strategy: 'test' },
  { condition: () => Boolean(env.EMAIL_HOST), strategy: 'smtp' },
  { condition: () => env.NODE_ENV === 'development', strategy: 'ethereal' }
]

const getTransportStrategy = (): keyof typeof transportStrategies => {
  const matchedRule = strategyRules.find(rule => rule.condition())
  return matchedRule?.strategy ?? 'fallback'
}

const createMailerConfig = async (): Promise<MailerConfig> => {
  const strategy = getTransportStrategy()
  const transport = await transportStrategies[strategy]()
  return {
    defaults: {
      from: env.EMAIL_FROM || 'noreply@cleanforum.com'
    },
    transport
  }
}

export const mailerPlugin = fastifyPlugin(
  async function (fastify: FastifyInstance) {
    const config = await createMailerConfig()
    await fastify.register(fastifyMailer, config)
  }
)
