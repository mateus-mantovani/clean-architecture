import OrderItem from './order_item'

export default class Order {
  private _id: number
  private _customerId: String
  private _items: Array<OrderItem> = []

  constructor (id: number, customerId: String, items: Array<OrderItem>) {
    this._id = id
    this._customerId = customerId
    this._items = items
  }

  total (): number {
    return this._items.reduce((acc, item) => acc + item.price, 0)
  }
}
