import Order from './order'
import OrderItem from './order_item'

describe('Order unit test', () => {
  it('should get the total price', () => {
    const item1 = new OrderItem(1, 'Item 1', 10, 'p1', 2)
    const item2 = new OrderItem(2, 'Item 2', 20, 'p2', 3)

    const order = new Order(1, '123', [item1, item2])
    expect(order.total).toBe(80)
  })

  it('should throw an error if the customer id is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const order = new Order(1, '', [])
    }).toThrowError('Customer id is invalid')
  })

  it('should throw an error if the order has no items', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const order = new Order(1, '123', [])
    }).toThrowError('Order must have at least one item')
  })

  it('should validate if the item quantity is valid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const item = new OrderItem(1, 'Item 1', 10, 'p1', 0)
    }).toThrowError('Item quantity is invalid')
  })

  it('should throw an error if the item id is invalid', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const item = new OrderItem(0, 'Item 1', 10, 'p1', 1)
    }).toThrowError('Item id is invalid')
  })
})
