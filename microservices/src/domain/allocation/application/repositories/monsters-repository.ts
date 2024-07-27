import { Monster } from '../../enterprise/entities/monster'

export abstract class MonstersRepository {
  abstract findById(id: string): Promise<Monster | null>
  abstract findByName(name: string): Promise<Monster | null>
  abstract create(monster: Monster): Promise<void>
}
