import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model'
import CustomerRepository from '../../../infrastructure/customer/repository/sequelize/customer.repository'
import ListCustomerUseCase from './list.customer.usecase'
import { OutputListCustomerDto } from './list.customer.dto'
import Customer from '../../../domain/customer/entity/customer'
import Address from '../../../domain/customer/entity/address'

describe('Integration test list customer use case', () => {
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

  it('should return a listo of customers', async () => {
    const customerRepository = new CustomerRepository()
    const listCustomerUseCase = new ListCustomerUseCase(customerRepository)

    const customer1 = new Customer('1233', 'John Customer')
    const customer2 = new Customer('3456', 'John Brother')
    const address = new Address('street', 123, 'zip', 'city')
    customer1.changeAddress(address)
    customer2.changeAddress(address)

    await customerRepository.create(customer1)
    await customerRepository.create(customer2)

    const output: OutputListCustomerDto = {
      customers: [
        {
          id: expect.any(String),
          name: 'John Customer',
          address: {
            city: 'city',
            number: 123,
            street: 'street',
            zip: 'zip'
          }
        },
        {
          id: expect.any(String),
          name: 'John Brother',
          address: {
            city: 'city',
            number: 123,
            street: 'street',
            zip: 'zip'
          }
        }
      ]
    }

    const result: OutputListCustomerDto = await listCustomerUseCase.execute({})

    expect(output).toEqual(result)
  })

  it('should return an empty list', async () => {
    const customerRepository = new CustomerRepository()
    const listCustomerUseCase = new ListCustomerUseCase(customerRepository)

    const result: OutputListCustomerDto = await listCustomerUseCase.execute({})

    expect({ customers: [] }).toEqual(result)
  })
})
