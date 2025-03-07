import type { UpdateUserData } from '@/application/repositories/users.repository'
import type { Rename } from '@/util/types/rename'

export type EditAccountRequest = Rename<UpdateUserData, 'id', 'userId'>
