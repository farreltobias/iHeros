import { faker } from '@faker-js/faker'

// import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rank, RankProps } from '@/domain/allocation/enterprise/entities/rank'

// import { PrismaRankMapper } from '@/infra/database/prisma/mappers/prisma-rank-mapper'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'

const ranks = [
  { name: 'S', level: 1 },
  { name: 'A', level: 2 },
  { name: 'B', level: 3 },
  { name: 'C', level: 4 },
]

export function makeRank(
  override: Partial<Pick<RankProps, 'level'>> = {},
  id?: UniqueEntityID,
) {
  const rank = Rank.create(
    {
      ...faker.helpers.arrayElement(
        ranks.filter(
          (rank) => !override.level || rank.level === override.level,
        ),
      ),
    },
    id,
  )

  return rank
}

// @Injectable()
// export class RankFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaRank(data: Partial<RankProps> = {}): Promise<Rank> {
//     const rank = makeRank(data)

//     await this.prisma.user.create({
//       data: PrismaRankMapper.toPrisma(rank),
//     })

//     return rank
//   }
// }
