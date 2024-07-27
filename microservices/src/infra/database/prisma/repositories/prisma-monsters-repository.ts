import { Injectable } from '@nestjs/common'

import { MonstersRepository } from '@/domain/allocation/application/repositories/monsters-repository'
import { Monster } from '@/domain/allocation/enterprise/entities/monster'

import { PrismaMonsterMapper } from '../mappers/prisma-monster-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMonstersRepository implements MonstersRepository {
  constructor(private prisma: PrismaService) {}

  async create(monster: Monster): Promise<void> {
    const data = PrismaMonsterMapper.toPrisma(monster)

    await this.prisma.monster.create({
      data,
    })
  }

  async findByName(name: string): Promise<Monster | null> {
    const monster = await this.prisma.monster.findUnique({
      where: { name },
    })

    if (!monster) return null

    return PrismaMonsterMapper.toDomain(monster)
  }

  async findById(id: string): Promise<Monster | null> {
    const monster = await this.prisma.monster.findUnique({
      where: { id },
    })

    if (!monster) return null

    return PrismaMonsterMapper.toDomain(monster)
  }
}
