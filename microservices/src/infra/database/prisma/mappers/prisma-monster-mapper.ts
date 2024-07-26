import { Monster as PrismaMonster, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Monster } from '@/domain/allocation/enterprise/entities/monster'

export class PrismaMonsterMapper {
  static toDomain(raw: PrismaMonster): Monster {
    return Monster.create(
      {
        name: raw.name,
        description: raw.description,
        photoUrl: raw.photoUrl,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(monster: Monster): Prisma.MonsterUncheckedCreateInput {
    return {
      id: monster.id.toString(),
      name: monster.name,
      description: monster.description,
      photoUrl: monster.photoUrl,
    }
  }
}
