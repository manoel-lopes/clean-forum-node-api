import { env } from '@/lib/env'

import { appFactory } from './fastify/app'

async function bootstrap () {
  try {
    const app = await appFactory()
    await app.listen({ port: env.PORT })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

bootstrap()
