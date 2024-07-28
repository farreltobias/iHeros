type Status = 'UNASSIGNED' | 'BATTLING' | 'RESOLVED'

export type Threat = {
  id: string
  dangerId: string
  monsterId: string
  heroId?: string | null
  durationTime?: number | null
  status: Status
  location: {
    lat: number
    lng: number
  }
  createdAt: Date
  battleStartedAt?: Date | null
  updatedAt?: Date | null
  monster: {
    id: string
    name: string
    description: string
    photoUrl: string
  }
  danger: {
    id: string
    name: string
    level: string
    duration: {
      min: number
      max: number
    }
  }
}
