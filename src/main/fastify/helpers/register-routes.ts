import path from 'node:path'
import type {
  FastifyInstance,
  preHandlerHookHandler,
} from 'fastify'

type RouteFunction = (app: FastifyInstance, tags: string[]) => Promise<void>

type RegisterRoutesOptions = {
  preHandler?: preHandlerHookHandler[] | preHandlerHookHandler
}

export function registerRoutes (
  app: FastifyInstance,
  routes: RouteFunction[],
  options: RegisterRoutesOptions = {}
) {
  const callingFile = new Error().stack?.split('\n')[2]?.match(/\((.*?):\d+:\d+\)$/)?.[1]
  if (!callingFile) throw new Error('Could not determine calling file')
  const fileName = path.basename(callingFile, '.ts')
  const routePrefix = fileName.replace('.routes', '')
  const tags = [routePrefix.charAt(0).toUpperCase() + routePrefix.slice(1)]
  app.register(async (scoped) => {
    const preHandlers = options.preHandler
      ? Array.isArray(options.preHandler) ? options.preHandler : [options.preHandler]
      : []

    for (const handler of preHandlers) {
      scoped.addHook('preHandler', handler)
    }

    for (const route of routes) {
      await route(scoped, tags)
    }
  }, { prefix: `/${routePrefix}` })
}
