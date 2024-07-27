import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { Emitter } from '@/domain/allocation/application/events/emitter'

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketServerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server

  private logger: Logger = new Logger(SocketServerGateway.name)

  constructor(private socketService: Emitter) {}

  afterInit(server: Server) {
    this.socketService.setServer(server)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }
}
