export enum ThreatStatusEnum {
  UNASSIGNED = 'UNASSIGNED',
  BATTLING = 'BATTLING',
  RESOLVED = 'RESOLVED',
}

export class ThreatStatus {
  public value: ThreatStatusEnum

  private constructor(value: ThreatStatusEnum) {
    this.value = value
  }

  static create(status = ThreatStatusEnum.UNASSIGNED) {
    return new ThreatStatus(status)
  }

  isEqual(status: ThreatStatusEnum) {
    return this.value === status
  }

  isBefore(status: ThreatStatusEnum) {
    const statusIndex = Object.keys(ThreatStatusEnum).indexOf(this.value)
    const newStatusIndex = Object.keys(ThreatStatusEnum).indexOf(status)

    return statusIndex - 1 === newStatusIndex
  }

  isNext(status: ThreatStatusEnum) {
    const statusIndex = Object.keys(ThreatStatusEnum).indexOf(this.value)
    const newStatusIndex = Object.keys(ThreatStatusEnum).indexOf(status)

    return statusIndex + 1 === newStatusIndex
  }

  isValid(status: ThreatStatusEnum) {
    return this.isNext(status)
  }
}
