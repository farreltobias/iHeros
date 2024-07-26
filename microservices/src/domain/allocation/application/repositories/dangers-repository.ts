import { Danger } from '../../enterprise/entities/danger'

export abstract class DangersRepository {
  abstract findByName(id: string): Promise<Danger | null>
  abstract findById(id: string): Promise<Danger | null>
}
