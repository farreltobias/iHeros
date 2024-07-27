import { Threat } from '@/domain/allocation/enterprise/entities/threat'

export class ThreatPresenter {
  static toHTTP(threat: Threat) {
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
    }
  }
}
