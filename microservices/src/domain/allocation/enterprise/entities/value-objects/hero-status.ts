export enum HeroStatusEnum {
  UNASSIGNED = 'UNASSIGNED',
  BATTLING = 'BATTLING',
}

export class HeroStatus {
  public value: HeroStatusEnum

  private constructor(value: HeroStatusEnum) {
    this.value = value
  }

  static create(status = HeroStatusEnum.UNASSIGNED) {
    return new HeroStatus(status)
  }

  isEqual(status: HeroStatusEnum) {
    return this.value === status
  }

  isBefore(status: HeroStatusEnum) {
    const statusIndex = Object.keys(HeroStatusEnum).indexOf(this.value)
    const newStatusIndex = Object.keys(HeroStatusEnum).indexOf(status)

    return statusIndex - 1 === newStatusIndex
  }

  isNext(status: HeroStatusEnum) {
    const statusIndex = Object.keys(HeroStatusEnum).indexOf(this.value)
    const newStatusIndex = Object.keys(HeroStatusEnum).indexOf(status)

    return statusIndex + 1 === newStatusIndex
  }

  isValid(status: HeroStatusEnum) {
    return this.isNext(status) || this.isBefore(status)
  }
}
