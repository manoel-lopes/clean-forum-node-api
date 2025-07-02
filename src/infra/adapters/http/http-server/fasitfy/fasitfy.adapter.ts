import Fastify from 'fastify'
import type { FastifyInstance, FastifyRequest, FastifyReply, FastifySchemaCompiler } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type { Schema } from 'zod'
import type {
  HttpServer,
  Middleware,
  RouteOptions,
  ListenOptions,
  ErrorHandler,
  SchemaParser,
} from '@/infra/adapters/http/ports/http-server'
import type { HttpMethod } from '@/infra/http/ports/http-protocol'

type ServerRoute = {
  method: HttpMethod
  url: string
  options: RouteOptions
  handlers: Middleware[]
}

type RouteHandlersOptions = {
  req: FastifyRequest
  reply: FastifyReply
  handlers: Middleware[]
}

type Config = {
  logger?: boolean
  openapi?: {
    info?: {
      title: string
      version: string
    }
  }
}

export class FastifyAdapter implements HttpServer {
  private readonly app: FastifyInstance

  constructor (private readonly config?: Config) {
    this.app = this.createAppInstance()
    this.registerPlugins()
  }

  private createAppInstance () {
    return Fastify({
      logger: this.config?.logger,
    }).withTypeProvider<ZodTypeProvider>()
  }

  private registerPlugins () {
    this.app.register(cors)
    this.app.setSerializerCompiler(serializerCompiler)
    this.app.register(fastifySwagger, {
      openapi: this.config?.openapi,
      transform: jsonSchemaTransform,
    })
    this.app.register(fastifySwaggerUi, { routePrefix: '/docs' })
  }

  register (setupRoute: (app: HttpServer) => void) {
    setupRoute(this)
  }

  get (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'GET', url, options, handlers })
  }

  post (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'POST', url, options, handlers })
  }

  put (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'PUT', url, options, handlers })
  }

  patch (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'PATCH', url, options, handlers })
  }

  delete (url: string, options: RouteOptions, ...handlers: Middleware[]) {
    this.registerRoute({ method: 'DELETE', url, options, handlers })
  }

  setErrorHandler (errorHandler: ErrorHandler) {
    this.app.setErrorHandler(errorHandler)
  }

  setValidationCompiler (parserFn: SchemaParser<Schema>) {
    const validationCompiler: FastifySchemaCompiler<Schema> = ({ schema }) => {
      return (data: unknown) => parserFn(schema, data)
    }
    this.app.setValidatorCompiler(validationCompiler)
  }

  async listen (options: ListenOptions) {
    await this.app.listen({ host: '0.0.0.0', ...options })
  }

  async close () {
    await this.app.close()
  }

  private registerRoute (route: ServerRoute) {
    const { options, handlers } = route
    const schema = { ...options.schema, ...options.schema?.request }
    this.app.register(instance => {
      instance.route({
        ...route,
        schema,
        handler: (req, reply) => this.registerRouteHandlers({ req, reply, handlers }),
      })
    })
  }

  private async registerRouteHandlers ({ handlers, req, reply }: RouteHandlersOptions) {
    try {
      for (const handler of handlers) {
        const response = await handler(req, reply)
        if (response) reply.send(response)
      }
    } catch (error) {
      this.app.log.error(error)
      reply.send(error)
    }
  }
}
