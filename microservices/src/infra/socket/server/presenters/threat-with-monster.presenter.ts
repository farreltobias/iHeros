import { Monster } from '@/domain/allocation/enterprise/entities/monster'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'

type ThreatWithMonster = {
  threat: Threat
  monster: Monster
}

export class ThreatWithMonsterPresenter {
  static toHTTP({ threat, monster }: ThreatWithMonster) {
    return {
      id: threat.id.toString(),
      dangerId: threat.dangerId.toString(),
      monsterId: threat.monsterId.toString(),
      heroId: threat.heroId?.toString() ?? null,
      durationTime: threat.durationTime ?? null,
      status: threat.status.value,
      location: {
        lat: threat.location.lat,
        lng: threat.location.lng,
      },
      createdAt: threat.createdAt,
      battleStartedAt: threat.battleStartedAt ?? null,
      updatedAt: threat.updatedAt,
      monster: {
        id: monster.id.toString(),
        name: monster.name,
        description: monster.description,
        photoUrl: monster.photoUrl,
      },
    }
  }
}
