import { Threat } from '../../enterprise/entities/threat'
import { Location } from '../../enterprise/entities/value-objects/location'

export abstract class ThreatsRepository {
  abstract findById(id: string): Promise<Threat | null>
  abstract findByHeroId(heroId: string): Promise<Threat | null>
  abstract create(threat: Threat): Promise<void>
  abstract save(threat: Threat): Promise<void>
  abstract delete(threat: Threat): Promise<void>
  abstract fetchThreatsBattling(): Promise<Threat[]>
  abstract findNearby(
    location: Location,
    rankLevel: number,
  ): Promise<Threat | null>
}
