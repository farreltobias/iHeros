// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface Tables {
    heroes: {
      id: number
      name: string
      status: 'UNASSIGNED' | 'BATTLING'
      location: {
        address: string
        coordinates: {
          lat: number
          lng: number
        }
        geohash: string
      }
      published_at?: string | null
    }

    heroes_rank_links: {
      id: number
      hero_id: number
      rank_id: number
    }

    rank: {
      id: number
      name: string
      level: number
    }
  }
}
