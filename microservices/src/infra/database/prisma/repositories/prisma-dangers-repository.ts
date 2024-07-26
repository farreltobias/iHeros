import { Injectable } from '@nestjs/common'

import { DangersRepository } from '@/domain/allocation/application/repositories/dangers-repository'
import { Danger } from '@/domain/allocation/enterprise/entities/danger'

import { PrismaDangerMapper } from '../mappers/prisma-danger-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDangersRepository implements DangersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Danger | null> {
    const danger = await this.prisma.danger.findUnique({
      where: { id },
    })

    if (!danger) return null

    return PrismaDangerMapper.toDomain(danger)
  }

  async findByName(name: string): Promise<Danger | null> {
    const danger = await this.prisma.danger.findUnique({
      where: { name },
    })

    if (!danger) return null

    return PrismaDangerMapper.toDomain(danger)
  }
}
