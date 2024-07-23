import { UseCaseError } from '@/core/errors/use-case-error'

export class HeroNotInBattleError extends Error implements UseCaseError {
  constructor() {
    super('The hero is not in battle')
  }
}
