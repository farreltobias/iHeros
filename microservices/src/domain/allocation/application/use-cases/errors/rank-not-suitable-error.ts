import { UseCaseError } from '@/core/errors/use-case-error'

export class RankNotSuitableError extends Error implements UseCaseError {
  constructor() {
    super('The rank is not suitable for the danger')
  }
}
