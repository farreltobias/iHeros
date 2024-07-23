import { Rank } from '../../enterprise/entities/rank'

export abstract class RanksRepository {
  abstract findById(id: string): Promise<Rank | null>
}
