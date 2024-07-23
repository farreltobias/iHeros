import { UseCaseError } from '@/core/errors/use-case-error'

export class WrongThreatStatusError extends Error implements UseCaseError {
  constructor() {
    super('The threat status is not suitable for this operation')
  }
}
