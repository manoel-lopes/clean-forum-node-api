import type { User } from '@/domain/entities/user/user.entity'

export function parseUsers (jsonString: string): User[] {
  if (!jsonString.trim()) {
    return []
  }

  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) {
      return []
    }

    return data
      .map((user) => isValidUser(user) ? user : null)
      .filter((user): user is User => user !== null)
  } catch {
    return []
  }
}

function isValidUser (user: unknown): user is User {
  return (
    user !== null &&
    user !== undefined &&
    typeof user === 'object' &&
    'id' in user &&
    typeof user.id === 'string' &&
    'name' in user &&
    typeof user.name === 'string' &&
    'email' in user &&
    typeof user.email === 'string' &&
    'password' in user &&
    typeof user.password === 'string'
  )
}
