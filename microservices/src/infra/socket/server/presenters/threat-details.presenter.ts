import { Danger } from '@/domain/allocation/enterprise/entities/danger'
import { Monster } from '@/domain/allocation/enterprise/entities/monster'
import { Threat } from '@/domain/allocation/enterprise/entities/threat'

type ThreatDetails = {
  threat: Threat
  monster: Monster
  danger: Danger
}

export class ThreatDetailsPresenter {
  static toHTTP({ threat, monster, danger }: ThreatDetails) {
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
      danger: {
        id: danger.id.toString(),
        name: danger.name,
        level: danger.level,
        duration: danger.duration.toValue(),
      },
    }
  }
}
