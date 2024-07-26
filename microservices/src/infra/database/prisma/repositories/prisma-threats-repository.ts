import { Injectable } from '@nestjs/common'

import { ThreatsRepository } from '@/domain/allocation/application/repositories/threats-repository'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'

import { PrismaThreatMapper } from '../mappers/prisma-threat-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaThreatsRepository implements ThreatsRepository {
  constructor(private prisma: PrismaService) {}

  async create(threat: Threat): Promise<void> {
    const data = PrismaThreatMapper.toPrisma(threat)

    await this.prisma.threat.create({
      data,
    })
  }

  async findById(id: string): Promise<Threat | null> {
    const threat = await this.prisma.threat.findUnique({
      where: { id },
    })

    if (!threat) return null

    return PrismaThreatMapper.toDomain(threat)
  }

  async findByHeroId(heroId: string): Promise<Threat | null> {
    const threat = await this.prisma.threat.findFirst({
      where: { heroId },
    })

    if (!threat) return null

    return PrismaThreatMapper.toDomain(threat)
  }

  async save(threat: Threat): Promise<void> {
    const data = PrismaThreatMapper.toPrisma(threat)

    await this.prisma.threat.update({
      where: { id: threat.id.toString() },
      data,
    })
  }
}
