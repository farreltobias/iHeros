import { Threat } from '../../enterprise/entities/threat'

export abstract class ThreatsRepository {
  abstract findById(id: string): Promise<Threat | null>
  abstract findByHeroId(heroId: string): Promise<Threat | null>
  abstract create(threat: Threat): Promise<void>
  abstract save(threat: Threat): Promise<void>
}
