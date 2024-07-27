import { PrismaClient } from '@prisma/client'

import { Danger } from '@/domain/allocation/enterprise/entities/danger'
import { dangers } from '@/domain/allocation/enterprise/initial-data'
import { PrismaDangerMapper } from '@/infra/database/prisma/mappers/prisma-danger-mapper'

const prisma = new PrismaClient()

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
