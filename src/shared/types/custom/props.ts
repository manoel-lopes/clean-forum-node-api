import type { Optional } from '../common/optional'

type InterfaceFrom<T> = T extends { prototype: infer R } ? R : never

export type Props<Item> =
  Optional<
    Omit<InterfaceFrom<Item>, 'id'>,
    Extract<'createdAt' | 'updatedAt', keyof Omit<InterfaceFrom<Item>, 'id'>>
  >
