import OrderItem from '../entity/order_item'
import Order from '../entity/order'
import OrderService from './order.service'
import Customer from '../entity/customer'

describe('Order service unit tests', () => {
  it('should get total of all orders', () => {
    const orderItem = new OrderItem('1', 'produto1', 100, 'pid1', 1)
    const orderItem2 = new OrderItem('2', 'produto2', 200, 'pid2', 2)

    const order = new Order('1', 'customer1', [orderItem])
    const order2 = new Order('2', 'customer2', [orderItem2])

    const total = OrderService.getTotal(order, order2)

    expect(total).toBe(500)
  })

  it('should place an order', () => {
    const customer = new Customer('1', 'customer1')
    const item1 = new OrderItem('1', 'produto1', 100, 'pid1', 1)
    const order = OrderService.placeOrder(customer, [item1])

    expect(customer.rewardPoints).toBe(50)
    expect(order.total).toBe(100)
  })
})
