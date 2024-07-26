import { Module } from '@nestjs/common'

import { DangersRepository } from '@/domain/allocation/application/repositories/dangers-repository'
import { HeroesRepository } from '@/domain/allocation/application/repositories/heroes-repository'
import { MonstersRepository } from '@/domain/allocation/application/repositories/monsters-repository'
import { RanksRepository } from '@/domain/allocation/application/repositories/ranks-repository'
import { ThreatsRepository } from '@/domain/allocation/application/repositories/threats-repository'

import { EnvModule } from '../env/env.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaDangersRepository } from './prisma/repositories/prisma-dangers-repository'
import { PrismaMonstersRepository } from './prisma/repositories/prisma-monsters-repository'
import { PrismaThreatsRepository } from './prisma/repositories/prisma-threats-repository'
import { StrapiHeroesRepository } from './strapi/repositories/strapi-heroes-repository'
import { StrapiRanksRepository } from './strapi/repositories/strapi-ranks-repository'
import { StrapiService } from './strapi/strapi.service'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    StrapiService,
    {
      provide: DangersRepository,
      useClass: PrismaDangersRepository,
    },
    {
      provide: ThreatsRepository,
      useClass: PrismaThreatsRepository,
    },
    {
      provide: MonstersRepository,
      useClass: PrismaMonstersRepository,
    },
    {
      provide: HeroesRepository,
      useClass: StrapiHeroesRepository,
    },
    {
      provide: RanksRepository,
      useClass: StrapiRanksRepository,
    },
  ],
  exports: [
    PrismaService,
    DangersRepository,
    ThreatsRepository,
    HeroesRepository,
    RanksRepository,
    MonstersRepository,
  ],
})
export class DatabaseModule {}
