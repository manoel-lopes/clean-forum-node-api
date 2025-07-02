type Request = Record<string, unknown>
type Response = unknown

export type UseCase = {
  execute(req: Request): Promise<Response>
}
