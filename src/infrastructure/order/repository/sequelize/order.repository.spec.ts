import { Sequelize } from 'sequelize-typescript'
import Address from '../../../../domain/customer/entity/address'
import Customer from '../../../../domain/customer/entity/customer'
import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/order_item'
import Product from '../../../../domain/product/entity/product'
import CustomerModel from '../../../customer/repository/sequelize/customer.model'
import OrderItemModel from './order-item.model '
import OrderModel from './order.model'
import ProductModel from '../../../product/repository/sequelize/product.model'
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository'
import OrderRepository from './order.repository'
import ProductRepository from '../../../product/repository/sequelize/product.repository'

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

  it('should update an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('street 1', 1, 'zipcode 1', 'city 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'product 1', 10)
    const product2 = new Product('2', 'product 2', 10)

    await productRepository.create(product)
    await productRepository.create(product2)

    const orderItem = new OrderItem('1', 'Product name 1', 100, '1', 2)
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

    const newOrderItem = new OrderItem('2', 'Product name 2', 200, '2', 2)
    order.changeItems([orderItem, newOrderItem])
    await orderRepository.update(order)

    const order1Model = await OrderModel.findOne(
      {
        where: {
          id: order.id
        },
        include: ['items']
      }
    )

    expect(order1Model).toBeDefined()
    expect(order1Model.toJSON()).toStrictEqual({
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
        },
        {
          id: newOrderItem.id,
          order_id: order.id,
          product_id: newOrderItem.productId,
          quantity: newOrderItem.quantity,
          name: newOrderItem.name,
          price: newOrderItem.price
        }
      ]
    })
  })

  it('should throw error when trying to update an order that does not exist', async () => {
    const orderRepository = new OrderRepository()
    const newOrderItem = new OrderItem('2', 'Product name 2', 200, '2', 2)
    const order1WithNewItem = new Order('1', 'customerid', [newOrderItem])
    await expect(orderRepository.update(order1WithNewItem)).rejects.toThrowError()
  })

  it('should rollback on update an order when product 2 does not exist', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('street 1', 1, 'zipcode 1', 'city 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'product 1', 10)
    // const product2 = new Product('2', 'product 2', 10) // will fail, because product 2 does not exist

    await productRepository.create(product)
    // await productRepository.create(product2)

    const orderItem = new OrderItem('1', 'Product name 1', 100, '1', 2)
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

    const newOrderItem = new OrderItem('2', 'Product name 2', 200, '2', 2)
    const order1WithNewItem = new Order('1', customer.id, [orderItem, newOrderItem])

    await expect(orderRepository.update(order1WithNewItem)).rejects.toThrowError('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed')

    const order1Model = await OrderModel.findOne(
      {
        where: {
          id: 1
        },
        include: ['items']
      }
    )

    expect(order1Model).toBeDefined()
    expect(order1Model.toJSON()).toStrictEqual({
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

  it('should find an order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('street 1', 1, 'zipcode 1', 'city 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('1', 'Product name 1', 100, '1', 2)
    const order = new Order('1', customer.id, [orderItem])
    const orderRepository = new OrderRepository()

    await orderRepository.create(order)

    const orderEntityFromDatabase = await orderRepository.find('1')

    expect(orderEntityFromDatabase).toBeDefined()
    expect(orderEntityFromDatabase).toEqual(order)
  })

  it('should throw error when order does not exist', async () => {
    const orderRepository = new OrderRepository()
    await expect(orderRepository.find('1')).rejects.toThrowError('Order not found')
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('street 1', 1, 'zipcode 1', 'city 1')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'product 1', 10)
    await productRepository.create(product)

    const orderItem = new OrderItem('1', 'Product name 1', 100, '1', 10)
    const orderItem2 = new OrderItem('2', 'Product name 1', 100, '1', 10)

    const order = new Order('1', customer.id, [orderItem])
    const order2 = new Order('2', customer.id, [orderItem2])
    const orderRepository = new OrderRepository()

    await orderRepository.create(order)
    await orderRepository.create(order2)

    const orderEntityFromDatabase = await orderRepository.findAll()

    expect(orderEntityFromDatabase).toBeDefined()
    expect(orderEntityFromDatabase).toEqual([order, order2])
  })
})
