import { PrismaClient } from '@prisma/client'

import { Danger } from '@/domain/allocation/enterprise/entities/danger'
import { Duration } from '@/domain/allocation/enterprise/entities/value-objects/duration'
import { PrismaDangerMapper } from '@/infra/database/prisma/mappers/prisma-danger-mapper'

const prisma = new PrismaClient()

export const dangers = [
  {
    name: 'God',
    level: 1,
    duration: new Duration({ min: 300, max: 600 }),
  },
  {
    name: 'Dragon',
    level: 2,
    duration: new Duration({ min: 120, max: 300 }),
  },
  {
    name: 'Tiger',
    level: 3,
    duration: new Duration({ min: 10, max: 20 }),
  },
  {
    name: 'Wolf',
    level: 4,
    duration: new Duration({ min: 1, max: 2 }),
  },
] as const

async function main() {
  const data = dangers
    .map((danger) => Danger.create(danger))
    .map(PrismaDangerMapper.toPrisma)

  const nodeDangers = await prisma.danger.createMany({ data })

  console.log({ nodeDangers })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
