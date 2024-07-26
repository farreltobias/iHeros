import { Danger as PrismaDanger, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Danger } from '@/domain/allocation/enterprise/entities/danger'
import { Duration } from '@/domain/allocation/enterprise/entities/value-objects/duration'

export class PrismaDangerMapper {
  static toDomain(raw: PrismaDanger): Danger {
    return Danger.create(
      {
        name: raw.name,
        level: raw.level,
        duration: new Duration({
          min: raw.minDuration,
          max: raw.maxDuration,
        }),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(danger: Danger): Prisma.DangerUncheckedCreateInput {
    return {
      id: danger.id.toString(),
      name: danger.name,
      level: danger.level,
      minDuration: danger.duration.min,
      maxDuration: danger.duration.max,
    }
  }
}
