import Order from '../../domain/entity/order'
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
    const transaction = await OrderModel.sequelize.transaction()
    const order = await OrderModel.findOne({ where: { id: entity.id }, transaction })
    if (!order) {
      transaction.rollback()
      throw new Error('Order not found')
    }

    try {
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
        customer_id: entity.customerId,
        total: entity.totalPrice()
      }, { where: { id: entity.id }, transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async find (id: string): Promise<Order> {
    return Promise.resolve(null)
  }

  async findAll (): Promise<Order[]> {
    return Promise.resolve([])
  }
}
