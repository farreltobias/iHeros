import { Logger as NestLogger, Module } from '@nestjs/common'

import { Logger } from '@/domain/allocation/application/log/logger'

@Module({
  providers: [
    {
      provide: Logger,
      useClass: NestLogger,
    },
  ],
  exports: [Logger],
})
export class LogModule {}
