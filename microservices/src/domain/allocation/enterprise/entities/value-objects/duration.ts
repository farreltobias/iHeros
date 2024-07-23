export type DurationType = {
  min: number
  max: number
}

export class Duration {
  private value: DurationType

  toValue(): DurationType {
    return this.value
  }

  constructor(value?: DurationType) {
    if (value && value.min > value.max) {
      throw new Error('Duration min value must be less than max value')
    }

    if (value && value.min < 1) {
      throw new Error('Duration min value must be greater than 1')
    }

    if (value && value.max > 600) {
      throw new Error('Duration max value must be less than 600')
    }

    this.value = value ?? { min: 1, max: 600 }
  }

  get time(): number {
    return Math.floor(
      Math.random() * (this.value.max - this.value.min + 1) + this.value.min,
    )
  }

  equals(duration: DurationType): boolean {
    return this.value.min === duration.min && this.value.max === duration.max
  }

  isBetween(min: number, max: number): boolean {
    return this.value.min >= min && this.value.max <= max
  }

  isGreaterThan(min: number): boolean {
    return this.value.min > min
  }

  isLessThan(max: number): boolean {
    return this.value.max < max
  }
}
