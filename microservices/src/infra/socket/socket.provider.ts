import { Injectable } from '@nestjs/common'
import { io, Socket } from 'socket.io-client'

import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class SocketIoClientProvider {
  private socket?: Socket

  constructor(private envService: EnvService) {}

  private connect() {
    const socketUrl = this.envService.get('SOCKET_URL')
    this.socket = io(socketUrl)

    return this.socket
  }

  getSocket = () => {
    if (!this.socket) {
      return this.connect()
    }
    return this.socket
  }
}
