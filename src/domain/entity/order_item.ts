export default class OrderItem {
  private _id: number
  private _name: string
  private _price: number
  private _productId: string
  private _quantity: number

  constructor (id: number, name: string, price: number, productId: string, quantity: number) {
    this._id = id
    this._name = name
    this._price = price
    this._productId = productId
    this._quantity = quantity
    this.validate()
  }

  validate (): boolean {
    if (this._id <= 0) {
      throw new Error('Item id is invalid')
    }

    if (this._quantity <= 0) {
      throw new Error('Item quantity is invalid')
    }
    return true
  }

  get price (): number {
    return this._price * this._quantity
  }

  get quantity (): number {
    return this._quantity
  }
}
