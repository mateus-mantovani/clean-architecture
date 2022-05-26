import Address from './address'

export default class Customer {
  private _id: string
  private _name: string
  private _address!: Address
  private _active: boolean = true

  constructor (id: string, name: string, address: string) {
    this._id = id
    this._name = name
    this.validate()
  }

  validate (): void {
    if (this._id === undefined || this._id === null) {
      throw new Error('Id is required')
    }
    if (this._name === undefined || this._name === null) {
      throw new Error('Name is required')
    }
    if (this._address === undefined || this._address === null) {
      throw new Error('Address is required')
    }
  }

  changeName (name: string): void {
    this._name = name
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

  set address (address: Address) {
    this._address = address
    this.validate()
  }

  get address (): Address {
    return this._address
  }
}
