import { vi } from 'vitest'
import type { UseCase } from '@/core/application/use-case'

export class UseCaseStub implements UseCase {
  execute = vi.fn(async () => Promise.resolve())
}
