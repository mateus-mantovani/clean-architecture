export default class OrderItem {
  private _id: number
  private _name: string
  private _price: number

  constructor (id: number, name: string, price: number) {
    this._id = id
    this._name = name
    this._price = price
  }

  get price (): number {
    return this._price
  }
}
