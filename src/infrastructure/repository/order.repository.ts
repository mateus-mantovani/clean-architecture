import Order from '../../domain/entity/order'
import OrderItem from '../../domain/entity/order_item'
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface'
import OrderItemModel from '../db/sequelize/model/order-item.model '
import OrderModel from '../db/sequelize/model/order.model'

export default class OrderRepository implements OrderRepositoryInterface {
  async create (entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.totalPrice(),
      items: entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.productId
      }))
    }, {
      include: [{ model: OrderItemModel }]
    })
  }

  async update (entity: Order): Promise<void> {
    await OrderModel.sequelize.transaction(async (transaction) => {
      const order = await OrderModel.findOne({ where: { id: entity.id } })
      if (!order) {
        throw new Error('Order not found')
      }
      await OrderItemModel.destroy({ where: { order_id: entity.id }, transaction })
      await OrderItemModel.bulkCreate(entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.productId,
        order_id: entity.id
      })), { transaction })
      await OrderModel.update({
        total: entity.totalPrice()
      }, { where: { id: entity.id }, transaction })
    })
  }

  async find (id: string): Promise<Order> {
    let order
    try {
      order = await OrderModel.findOne({ where: { id }, rejectOnEmpty: true, include: ['items'] })
    } catch (error) {
      throw new Error('Order not found')
    }

    return new Order(order.id, order.customer_id, order.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)))
  }

  async findAll (): Promise<Order[]> {
    return Promise.resolve([])
  }
}
