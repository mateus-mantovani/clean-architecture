import OrderItem from './order_item'

export default class Order {
  private _id: String
  private _customerId: String
  private _items: Array<OrderItem> = []
  private _total: number

  constructor (id: String, customerId: String, items: Array<OrderItem>) {
    this._id = id
    this._customerId = customerId
    this._items = items
    this._total = this.totalPrice()
    this.validate()
  }

  validate (): boolean {
    if (this._customerId.length === 0) {
      throw new Error('Customer id is invalid')
    }

    if (this._items.length === 0) {
      throw new Error('Order must have at least one item')
    }

    return true
  }

  totalPrice (): number {
    return this._items.reduce((acc, item) => acc + item.price, 0)
  }

  get id () {
    return this._id
  }

  get total () {
    return this._total
  }

  get customerId () {
    return this._customerId
  }

  get items () {
    return this._items
  }
}
