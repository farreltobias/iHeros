import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

import {
  EmitEndBattleData,
  EmitStartBattleData,
  Emitter,
  EmitThreatData,
} from '@/domain/allocation/application/events/emitter'

import { ThreatPresenter } from './presenters/threat.presenter'
import { ThreatDetailsPresenter } from './presenters/threat-details.presenter'

@Injectable()
export class SocketServerService implements Emitter {
  private socket?: Server

  setServer(socket: Server) {
    this.socket = socket
  }

  emitThreat(data: EmitThreatData) {
    this.socket?.emit('threat', ThreatDetailsPresenter.toHTTP(data))
  }

  emitStartBattle(data: EmitStartBattleData): void {
    this.socket?.emit('battle.start', ThreatPresenter.toHTTP(data.threat))
  }

  emitEndBattle(data: EmitEndBattleData): void {
    this.socket?.emit('battle.end', ThreatPresenter.toHTTP(data.threat))
  }
}
