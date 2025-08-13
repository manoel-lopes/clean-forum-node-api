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

  const callingPath = path.dirname(callingFile)
  const routesIndex = callingPath.indexOf('/routes/')
  if (routesIndex === -1) throw new Error('Calling file is not under routes directory')

  const pathAfterRoutes = callingPath.substring(routesIndex + '/routes/'.length)
  const firstLevelDirectory = pathAfterRoutes.split('/')[0]
  const tags = [firstLevelDirectory.charAt(0).toUpperCase() + firstLevelDirectory.slice(1)]
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
  }, { prefix: `/${firstLevelDirectory}` })
}
