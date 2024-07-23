import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Danger,
  DangerProps,
} from '@/domain/allocation/enterprise/entities/danger'
import { Duration } from '@/domain/allocation/enterprise/entities/value-objects/duration'

// import { PrismaDangerMapper } from '@/infra/database/prisma/mappers/prisma-danger-mapper'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'

const dangers = [
  {
    name: 'God',
    level: 1,
    duration: new Duration({ min: 1, max: 2 }),
  },
  {
    name: 'Dragon',
    level: 2,
    duration: new Duration({ min: 10, max: 20 }),
  },
  {
    name: 'Tiger',
    level: 3,
    duration: new Duration({ min: 120, max: 300 }),
  },
  {
    name: 'Wolf',
    level: 4,
    duration: new Duration({ min: 300, max: 600 }),
  },
]

export function makeDanger(
  override: Partial<Pick<DangerProps, 'level'>> = {},
  id?: UniqueEntityID,
) {
  const danger = Danger.create(
    {
      ...faker.helpers.arrayElement(
        dangers.filter(
          (danger) => !override.level || danger.level === override.level,
        ),
      ),
    },
    id,
  )

  return danger
}

// @Injectable()
// export class DangerFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaDanger(data: Partial<DangerProps> = {}): Promise<Danger> {
//     const danger = makeDanger(data)

//     await this.prisma.user.create({
//       data: PrismaDangerMapper.toPrisma(danger),
//     })

//     return danger
//   }
// }
