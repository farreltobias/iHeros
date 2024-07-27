import { Module } from '@nestjs/common'

import { Emitter } from '@/domain/allocation/application/events/emitter'

import { SocketServerGateway } from './socket-server.gateway'
import { SocketServerService } from './socket-server.service'

@Module({
  providers: [
    SocketServerGateway,
    {
      provide: Emitter,
      useClass: SocketServerService,
    },
  ],
  exports: [Emitter],
})
export class SocketServerModule {}
