class Address {
  private _street: string
  private _number: number
  private _zipCode: string
  private _city: string

  constructor (street: string, number: number, zipCode: string, city: string) {
    this._street = street
    this._number = number
    this._zipCode = zipCode
    this._city = city
    this.validate()
  }

  validate (): void {
    if (this._street === undefined || this._street === null || this._street === '') {
      throw new Error('Street is required')
    }

    if (this._number === undefined || this._number === null) {
      throw new Error('Number is required')
    }

    if (this._zipCode === undefined || this._zipCode === null) {
      throw new Error('Zip code is required')
    }

    if (this._city === undefined || this._city === null) {
      throw new Error('City is required')
    }
  }

  get street (): string {
    return this._street
  }

  get number (): number {
    return this._number
  }

  get zipCode (): string {
    return this._zipCode
  }

  get city (): string {
    return this._city
  }
}

export default Address
