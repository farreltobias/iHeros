import { Module } from '@nestjs/common'

import { SocketClientModule } from './client/socket-client.module'
import { SocketServerModule } from './server/socket-server.module'

@Module({
  imports: [SocketClientModule, SocketServerModule],
  exports: [SocketClientModule, SocketServerModule],
})
export class SocketModule {}
