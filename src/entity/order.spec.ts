import Order from './order'
import OrderItem from './order_item'

describe('Order unit test', () => {
  it('should get the total price', () => {
    const item1 = new OrderItem(1, 'Item 1', 10)
    const item2 = new OrderItem(2, 'Item 2', 20)

    const order = new Order(1, '123', [item1, item2])
    expect(order.totalPrice()).toBe(30)
  })
})
