import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Danger,
  DangerProps,
} from '@/domain/allocation/enterprise/entities/danger'
import { dangers } from '@/domain/allocation/enterprise/initial-data'

// import { PrismaDangerMapper } from '@/infra/database/prisma/mappers/prisma-danger-mapper'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeDanger(
  override: Partial<Pick<DangerProps, 'level'>> = {},
  id?: UniqueEntityID,
) {
  const dangersFiltered = dangers.filter(
    (danger) => !override.level || danger.level === override.level,
  )

  const danger = Danger.create(
    {
      ...faker.helpers.arrayElement(dangersFiltered),
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
