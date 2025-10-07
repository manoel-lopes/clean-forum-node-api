import type { Entity } from '@/core/domain/entity'
import type { Props } from '@/shared/types/custom/props'

export type EmailValidationProps = Props<EmailValidation>

export type EmailValidation = Entity & {
  email: string
  code: string
  expiresAt: Date
  isVerified: boolean
}
