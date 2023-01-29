import Entity from '../../@shared/entity/entity.abstract'
import NotificationError from '../../@shared/notification/notification.error'
import ProductInterface from './product.interface'

export default class Product extends Entity implements ProductInterface {
  private _name: string
  private _price: number

  constructor (id: string, name: string, price: number) {
    super()
    this._id = id
    this._name = name
    this._price = price
    this.validate()
  }

  changeName (name: string): void {
    this._name = name
    this.validate()
  }

  changePrice (price: number): void {
    this._price = price
    this.validate()
  }

  validate (): void {
    if (this._id.length === 0) {
      this.notification.addError({
        context: 'product',
        message: 'Product id is invalid'
      })
    }

    if (this._name.length === 0) {
      this.notification.addError({
        context: 'product',
        message: 'Product name is invalid'
      })
    }

    if (this._price <= 0) {
      this.notification.addError({
        context: 'product',
        message: 'Product price is invalid'
      })
    }

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }
  }

  get name () {
    return this._name
  }

  get price () {
    return this._price
  }
}
