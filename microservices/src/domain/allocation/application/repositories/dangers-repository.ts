import { Danger } from '../../enterprise/entities/danger'

export abstract class DangersRepository {
  abstract findById(id: string): Promise<Danger | null>
}
