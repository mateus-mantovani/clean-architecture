import { Sequelize } from 'sequelize-typescript'
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model'
import CustomerRepository from '../../../infrastructure/customer/repository/sequelize/customer.repository'
import { InputCreateCustomerDto, OutputCreateCustomerDto } from './create.customer.dto'
import CreateCustomerUseCase from './create.customer.usecase'

describe('Integration test create customer use case', () => {
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
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository)

    const input: InputCreateCustomerDto = {
      name: 'John Smith',
      address: {
        street: 'string',
        number: 123,
        zip: 'zip',
        city: 'city'
      }
    }

    const output: OutputCreateCustomerDto = {
      id: expect.any(String),
      name: 'John Smith',
      address: {
        street: 'string',
        number: 123,
        zip: 'zip',
        city: 'city'
      }
    }

    const result: OutputCreateCustomerDto = await createCustomerUseCase.execute(input)

    expect(result).toEqual(output)
  })
})
