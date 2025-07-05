import type { UseCase } from '@/core/application/use-case'

export class UseCaseStub implements UseCase {
  async execute (): Promise<void> {
    return Promise.resolve()
  }
}
