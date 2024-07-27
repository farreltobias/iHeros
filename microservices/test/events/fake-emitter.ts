/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from 'socket.io'
import { FakeLogger } from 'test/log/fake-logger'

import {
  EmitEndBattleData,
  EmitStartBattleData,
  Emitter,
  EmitThreatData,
} from '@/domain/allocation/application/events/emitter'

export class FakeEmitter implements Emitter {
  private logger = new FakeLogger()

  private context = FakeEmitter.name

  setServer(_: Server): void {}

  emitThreat(_: EmitThreatData): void {
    this.logger.log('emitThreat', this.context)
  }

  emitStartBattle(_: EmitStartBattleData): void {
    this.logger.log('emitStartBattle', this.context)
  }

  emitEndBattle(_: EmitEndBattleData): void {
    this.logger.log('emitEndBattle', this.context)
  }
}
