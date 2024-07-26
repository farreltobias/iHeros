import { Prisma, Threat as PrismaThreat } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'
import { ThreatStatus } from '@/domain/allocation/enterprise/entities/value-objects/threat-status'

export class PrismaThreatMapper {
  static toDomain(raw: PrismaThreat): Threat {
    return Threat.create(
      {
        monsterId: new UniqueEntityID(raw.monsterId),
        status: ThreatStatus.create(ThreatStatus[raw.status]),
        durationTime: raw.durationTime,
        location: new Location({
          lat: raw.latitude,
          lng: raw.longitude,
        }),

        dangerId: new UniqueEntityID(raw.dangerId),
        heroId: raw.heroId ? new UniqueEntityID(raw.heroId) : null,

        createdAt: raw.createdAt,
        battleStartedAt: raw.battleStartedAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(threat: Threat): Prisma.ThreatUncheckedCreateInput {
    return {
      id: threat.id.toString(),
      monsterId: threat.monsterId.toString(),
      dangerId: threat.dangerId.toString(),
      heroId: threat.heroId?.toString(),
      durationTime: threat.durationTime,
      battleStartedAt: threat.battleStartedAt,
      latitude: threat.location.lat,
      longitude: threat.location.lng,
      status: threat.status.value,
      createdAt: threat.createdAt,
      updatedAt: threat.updatedAt,
    }
  }
}
