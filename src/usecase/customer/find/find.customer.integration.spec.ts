import { Sequelize } from 'sequelize-typescript'
import Address from '../../../domain/customer/entity/address'
import Customer from '../../../domain/customer/entity/customer'
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model'
import CustomerRepository from '../../../infrastructure/customer/repository/sequelize/customer.repository'
import { InputFindCustomerDto, OutputFindCustomerDto } from './find.customer.dto'
import FindCustomerUseCase from './find.usecase'

describe('Test find customer use case', () => {
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

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const findCustomerUseCase = new FindCustomerUseCase(customerRepository)

    const customer = new Customer('123', 'John')
    const address = new Address('Street', 123, 'zip', 'city')
    customer.changeAddress(address)

    await customerRepository.create(customer)
    const input: InputFindCustomerDto = {
      id: '123'
    }

    const output: OutputFindCustomerDto = {
      id: '123',
      name: 'John',
      address: {
        street: 'Street',
        city: 'city',
        number: 123,
        zip: 'zip'
      }
    }

    const result: OutputFindCustomerDto = await findCustomerUseCase.execute(input)

    expect(result).toEqual(output)
  })
})
