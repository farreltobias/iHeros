import { Server } from 'socket.io'

import { Monster } from '../../enterprise/entities/monster'
import { Threat } from '../../enterprise/entities/threat'

export type EmitThreatData = {
  threat: Threat
  monster: Monster
}

export type EmitStartBattleData = {
  threat: Threat
}

export type EmitEndBattleData = {
  threat: Threat
}

export abstract class Emitter {
  abstract setServer(server: Server): void
  abstract emitThreat(data: EmitThreatData): void
  abstract emitStartBattle(data: EmitStartBattleData): void
  abstract emitEndBattle(data: EmitEndBattleData): void
}
