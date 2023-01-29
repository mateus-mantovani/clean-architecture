import Entity from '../../@shared/entity/entity.abstract'
import NotificationError from '../../@shared/notification/notification.error'
import Address from './address'
import CustomerInterface from './customer.interface'

export default class Customer extends Entity implements CustomerInterface {
  private _name: string
  private _address!: Address
  private _active: boolean = true
  private _rewardPoints: number = 0

  constructor (id: string, name: string) {
    super()
    this._id = id
    this._name = name
    this.validate()

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }
  }

  validate (): void {
    if (this.id === undefined || this.id === null || this.id === '') {
      this.notification.addError({
        context: 'customer',
        message: 'Id is required'
      })
    }

    if (this._name === undefined || this._name === null || this._name === '') {
      this.notification.addError({
        context: 'customer',
        message: 'Name is required'
      })
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
