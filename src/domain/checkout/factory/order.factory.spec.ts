import { v4 as uuid } from 'uuid'
import OrderFactory, { OrderFactoryProps } from './order.factory'
describe('Order factory unit test', () => {
  it('should create a order', () => {
    const orderProps: OrderFactoryProps = {
      id: uuid(),
      customerId: uuid(),
      items: [
        {
          id: uuid(),
          name: 'Item 1',
          productId: uuid(),
          quantity: 1,
          price: 100
        }
      ]
    }

    const order = OrderFactory.create(orderProps)
    expect(order).toBeDefined()
    expect(order.id).toBe(orderProps.id)
    expect(order.customerId).toBe(orderProps.customerId)
    expect(order.items).toBeDefined()
    expect(order.items.length).toBe(1)
    expect(order.items[0].id).toBe(orderProps.items[0].id)
    expect(order.items[0].name).toBe(orderProps.items[0].name)
    expect(order.items[0].productId).toBe(orderProps.items[0].productId)
    expect(order.items[0].quantity).toBe(orderProps.items[0].quantity)
    expect(order.items[0].price).toBe(orderProps.items[0].price)
  })
})
