import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Hero, HeroProps } from '@/domain/allocation/enterprise/entities/hero'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'
// import { PrismaHeroMapper } from '@/infra/database/prisma/mappers/prisma-hero-mapper'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeHero(
  override: Partial<HeroProps> = {},
  id?: UniqueEntityID,
) {
  const hero = Hero.create(
    {
      name: faker.person.fullName(),
      baseLocation: new Location({
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
      }),
      rankId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return hero
}

// @Injectable()
// export class HeroFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaHero(data: Partial<HeroProps> = {}): Promise<Hero> {
//     const hero = makeHero(data)

//     await this.prisma.user.create({
//       data: PrismaHeroMapper.toPrisma(hero),
//     })

//     return hero
//   }
// }
