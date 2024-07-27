import { Injectable } from '@nestjs/common'
import { Prisma, Threat as PrismaThreat } from '@prisma/client'

import { DomainEvents } from '@/core/events/domain-events'
import { CamelToSnakeCase, KeysToSnakeCase } from '@/core/types/camel-case'
import { ThreatsRepository } from '@/domain/allocation/application/repositories/threats-repository'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'
import { Location } from '@/domain/allocation/enterprise/entities/value-objects/location'
import { ThreatStatusEnum } from '@/domain/allocation/enterprise/entities/value-objects/threat-status'

import { PrismaThreatMapper } from '../mappers/prisma-threat-mapper'
import { PrismaService } from '../prisma.service'

type PrismaThreatRaw = KeysToSnakeCase<PrismaThreat>

@Injectable()
export class PrismaThreatsRepository implements ThreatsRepository {
  constructor(private prisma: PrismaService) {}

  async create(threat: Threat): Promise<void> {
    const data = PrismaThreatMapper.toPrisma(threat)

    await this.prisma.threat.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(threat.id)
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
      where: { heroId, status: 'BATTLING' },
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

    if (threat.status.isEqual(ThreatStatusEnum.RESOLVED)) {
      DomainEvents.dispatchEventsForAggregate(threat.id)
    }
  }

  async delete(threat: Threat): Promise<void> {
    await this.prisma.threat.delete({
      where: { id: threat.id.toString() },
    })
  }

  async fetchThreatsBattling(): Promise<Threat[]> {
    const threats = await this.prisma.threat.findMany({
      where: { status: 'BATTLING' },
    })

    return threats.map(PrismaThreatMapper.toDomain)
  }

  async findNearby(
    location: Location,
    rankLevel: number,
  ): Promise<Threat | null> {
    const levels = Array.from({ length: 4 - (rankLevel - 1) }, (_, i) => 4 - i)
    const { lat, lng } = location.toValue()

    const [threatRaw] = await this.prisma.$queryRaw<PrismaThreatRaw[]>`
      SELECT t.*
      FROM threats t
      JOIN dangers d ON t.danger_id = d.id
      WHERE d."level" IN (${Prisma.join(levels)})
        AND t.status = 'UNASSIGNED'
      ORDER BY d."level",
        ST_MakePoint(latitude::float, longitude::float)::geography <-> ST_MakePoint(${lat}, ${lng})::geography
      LIMIT 1
    `
    if (!threatRaw) return null

    const threat = Object.entries(threatRaw).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [this.snakeToCamel(key)]: value,
      }),
      {} as PrismaThreat,
    )

    return PrismaThreatMapper.toDomain(threat)
  }

  private snakeToCamel = (str: string): CamelToSnakeCase<typeof str> =>
    str
      .toLowerCase()
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', ''),
      )
}
