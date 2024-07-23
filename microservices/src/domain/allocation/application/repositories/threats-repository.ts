import { Threat } from '../../enterprise/entities/threat'

export abstract class ThreatsRepository {
  abstract findById(id: string): Promise<Threat | null>
  abstract save(threat: Threat): Promise<void>
}
