type ThreatStatus = 'UNASSIGNED' | 'BATTLING' | 'RESOLVED'

export type Location = {
  lat: number
  lng: number
}

export type Duration = {
  min: number
  max: number
}

export type Danger = {
  id: string
  name: string
  level: string
  duration: Duration
}

export type Monster = {
  id: string
  name: string
  description: string
  photoUrl: string
}

export type Threat = {
  id: string
  dangerId: string
  monsterId: string
  heroId?: string | null
  durationTime?: number | null
  status: ThreatStatus
  location: Location
  createdAt: Date
  battleStartedAt?: Date | null
  updatedAt?: Date | null
  monster: Monster
  danger: Danger
}

export type Rank = {
  name: string
  level: number
}

type HeroStatus = 'UNASSIGNED' | 'BATTLING'

export type Hero = {
  id: number
  status: HeroStatus
  name: string
  photoUrl: string
  location: Location
  rank: Rank
}
