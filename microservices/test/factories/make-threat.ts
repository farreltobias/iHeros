import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Threat,
  ThreatProps,
} from '@/domain/allocation/enterprise/entities/threat'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'
import { ThreatStatus } from '@/domain/allocation/enterprise/entities/value-objects/threat-status'
// import { PrismaThreatMapper } from '@/infra/database/prisma/mappers/prisma-threat-mapper'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeThreat(
  override: Partial<ThreatProps> = {},
  id?: UniqueEntityID,
) {
  const threat = Threat.create(
    {
      monsterName: faker.person.fullName(),
      location: new Location({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      }),
      dangerId: new UniqueEntityID(),
      status: ThreatStatus.create(),
      ...override,
    },
    id,
  )

  return threat
}

// @Injectable()
// export class ThreatFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaThreat(data: Partial<ThreatProps> = {}): Promise<Threat> {
//     const threat = makeThreat(data)

//     await this.prisma.user.create({
//       data: PrismaThreatMapper.toPrisma(threat),
//     })

//     return threat
//   }
// }
