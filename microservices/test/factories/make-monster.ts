import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Monster,
  MonsterProps,
} from '@/domain/allocation/enterprise/entities/monster'

// import { PrismaMonsterMapper } from '@/infra/database/prisma/mappers/prisma-monster-mapper'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeMonster(
  override: Partial<MonsterProps> = {},
  id?: UniqueEntityID,
) {
  const monster = Monster.create(
    {
      name: faker.person.firstName(),
      description: faker.lorem.sentence(),
      photoUrl: faker.image.url(),
      ...override,
    },
    id,
  )

  return monster
}

// @Injectable()
// export class MonsterFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaMonster(data: Partial<MonsterProps> = {}): Promise<Monster> {
//     const monster = makeMonster(data)

//     await this.prisma.user.create({
//       data: PrismaMonsterMapper.toPrisma(monster),
//     })

//     return monster
//   }
// }
