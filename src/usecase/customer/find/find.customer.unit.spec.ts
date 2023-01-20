import Address from '../../../domain/customer/entity/address'
import Customer from '../../../domain/customer/entity/customer'
import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repository.interface'
import { InputFindCustomerDto, OutputFindCustomerDto } from './find.customer.dto'
import FindCustomerUseCase from './find.usecase'

const customer = new Customer('123', 'John')
const address = new Address('Street', 123, 'zip', 'city')
customer.changeAddress(address)

describe('Unit Test find customer use case', () => {
  it('should find a customer', async () => {
    const MockRepository = (): CustomerRepositoryInterface => {
      return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    }
    const customerRepository = MockRepository()
    const findCustomerUseCase = new FindCustomerUseCase(customerRepository)

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

  it('should not find a customer', async () => {
    const MockRepository = (): CustomerRepositoryInterface => {
      return {
        find: jest.fn().mockImplementation(() => {
          throw new Error('Customer not found')
        }),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    }
    const customerRepository = MockRepository()

    const findCustomerUseCase = new FindCustomerUseCase(customerRepository)

    const input: InputFindCustomerDto = {
      id: '123'
    }

    expect(() => findCustomerUseCase.execute(input))
      .rejects.toThrow('Customer not found')
  })
})
