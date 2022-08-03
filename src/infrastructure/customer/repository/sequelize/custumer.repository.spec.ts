import { Sequelize } from 'sequelize-typescript'
import Address from '../../../../domain/customer/entity/address'
import Customer from '../../../../domain/customer/entity/customer'
import CustomerModel from './customer.model'
import CustomerRepository from './customer.repository'

describe('Customer repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    sequelize.close()
  })

  it('should create a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('Street', 100, '12345', 'City')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '1',
      name: customer.name,
      street: address.street,
      number: address.number,
      zipcode: address.zipCode,
      city: address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints
    })
  })

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('Street', 100, '12345', 'City')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '1',
      name: customer.name,
      street: address.street,
      number: address.number,
      zipcode: address.zipCode,
      city: address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints
    })

    customer.changeName('Jane Doe')
    customer.changeAddress(new Address('Street 2', 200, '23456', 'City 2'))

    await customerRepository.update(customer)

    const customerModel2 = await CustomerModel.findOne({ where: { id: '1' } })

    expect(customerModel2.toJSON()).toStrictEqual({
      id: '1',
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zipCode,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints
    })
  })

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('Street', 100, '12345', 'City')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({ where: { id: '1' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '1',
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zipCode,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints
    })

    const customer2 = await customerRepository.find('1')

    expect(customer2).toEqual(customer)
  })

  it('should find all customers', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'John Doe')
    const address = new Address('Street', 100, '12345', 'City')
    customer.changeAddress(address)

    await customerRepository.create(customer)

    const customer2 = new Customer('2', 'Jane Doe')
    const address2 = new Address('Street 2', 200, '23456', 'City 2')
    customer2.changeAddress(address2)

    await customerRepository.create(customer2)

    const customers = await customerRepository.findAll()

    expect(customers).toEqual([customer, customer2])
  })

  it('should thorw an error when customer does not exist', async () => {
    const customerRepository = new CustomerRepository()

    await expect(customerRepository.find('1')).rejects.toThrowError('Customer not found')
  })
})
