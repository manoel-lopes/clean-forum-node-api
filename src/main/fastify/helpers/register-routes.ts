import type { FastifyInstance } from 'fastify'
import path from 'node:path'

type RouteFunction = (app: FastifyInstance, tags: string[]) => Promise<void>

export function registerRoutes (app: FastifyInstance, routes: RouteFunction[]) {
  const callingFile = new Error().stack?.split('\n')[2]?.match(/\((.*?):\d+:\d+\)$/)?.[1]
  if (!callingFile) {
    throw new Error('Could not determine calling file')
  }

  const callingPath = path.dirname(callingFile)
  const routesIndex = callingPath.indexOf('/routes/')
  if (routesIndex === -1) {
    throw new Error('Calling file is not under routes directory')
  }

  const pathAfterRoutes = callingPath.substring(routesIndex + '/routes/'.length)
  const firstLevelDirectory = pathAfterRoutes.split('/')[0]

  const tags = [firstLevelDirectory.charAt(0).toUpperCase() + firstLevelDirectory.slice(1)]
  app.register(async (app) => {
    for (const route of routes) {
      await route(app, tags)
    }
  }, { prefix: `/${firstLevelDirectory}` })
}
