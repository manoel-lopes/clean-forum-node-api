import type { PaginatedItems } from '@/core/application/paginated-items'
import type { User } from '@/domain/entities/user/user.entity'

export class UserPresenter {
  static toHTTP (users: PaginatedItems<User>) {
    return {
      ...users,
      items: users.items.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    }
  }
}
