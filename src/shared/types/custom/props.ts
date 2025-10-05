import type { Optional } from '../common/optional'

type InterfaceFrom<T> = T extends { prototype: infer R } ? R : never

// Remove function properties (methods) from the type
type OnlyProperties<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

export type Props<Item> =
  Optional<
    Omit<OnlyProperties<InterfaceFrom<Item>>, 'id'>,
    Extract<'createdAt' | 'updatedAt', keyof Omit<OnlyProperties<InterfaceFrom<Item>>, 'id'>>
  >
