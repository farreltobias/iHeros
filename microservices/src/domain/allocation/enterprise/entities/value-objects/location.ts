export type LocationType = {
  lat: number
  lng: number
}

export class Location {
  private value: LocationType

  toValue(): LocationType {
    return this.value
  }

  get lat(): number {
    return this.value.lat
  }

  get lng(): number {
    return this.value.lng
  }

  constructor(value?: LocationType) {
    this.value = value ?? { lat: 0, lng: 0 }
  }

  equals(location: LocationType): boolean {
    return this.value.lat === location.lat && this.value.lng === location.lng
  }
}
