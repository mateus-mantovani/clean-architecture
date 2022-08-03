import Address from './address'

export default class Customer {
  private _id: string
  private _name: string
  private _address!: Address
  private _active: boolean = true
  private _rewardPoints: number = 0

  constructor (id: string, name: string) {
    this._id = id
    this._name = name
    this.validate()
  }

  validate (): void {
    if (this._id === undefined || this._id === null || this._id === '') {
      throw new Error('Id is required')
    }

    if (this._name === undefined || this._name === null || this._name === '') {
      throw new Error('Name is required')
    }
  }

  changeName (name: string): void {
    this._name = name
    this.validate()
  }

  changeAddress (address: Address): void {
    this._address = address
    this.validate()
  }

  activate (): void {
    if (this._address === undefined || this._address === null) {
      throw new Error('Address is required')
    }
    this._active = true
  }

  deactivate (): void {
    this._active = false
  }

  isActive (): boolean {
    return this._active
  }

  addRewardPoints (points: number): void {
    this._rewardPoints += points
  }

  get id (): string {
    return this._id
  }

  get address (): Address {
    return this._address
  }

  get name (): string {
    return this._name
  }

  get rewardPoints (): number {
    return this._rewardPoints
  }
}
