import { Sequelize } from 'sequelize-typescript'
import Address from '../../domain/entity/address'
import Customer from '../../domain/entity/customer'
import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import Product from '../../domain/entity/product'
import CustomerModel from '../db/sequelize/model/customer.model'
import OrderItemModel from '../db/sequelize/model/order-item.model '
import OrderModel from '../db/sequelize/model/order.model'
import ProductModel from '../db/sequelize/model/product.model'
import CustomerRepository from './customer.repository'
import OrderRepository from './order.repository'
import ProductRepository from './product.repository'

describe('Order repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    sequelize.close()
  })

  it('should create an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('street 1', 1, 'zipcode 1', 'city 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('1', 'Product name 1', 100, '1', 10)
    const order = new Order('1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()

    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne(
      {
        where: {
          id: order.id
        },
        include: ['items']
      }
    )

    expect(orderModel).toBeDefined()
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total,
      items: [
        {
          id: orderItem.id,
          order_id: order.id,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
          name: orderItem.name,
          price: orderItem.price
        }
      ]
    })
  })
})
