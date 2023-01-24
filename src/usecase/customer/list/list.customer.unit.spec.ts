import Address from '../../../domain/customer/entity/address'
import CustomerFactory from '../../../domain/customer/factory/customer.factory'
import ListCustomerUseCase from './list.customer.usecase'

const customer1 = CustomerFactory.createWithAddress(
  'John',
  new Address('street', 111, 'zip code', 'city'))

const customer2 = CustomerFactory.createWithAddress(
  'Anna',
  new Address('street 2', 333, 'zip code 554', 'city 111'))

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2]))
  }
}

describe('Unit test for listing customer usecase', () => {
  it('should list a customer', async () => {
    const repository = MockRepository()
    const useCase = new ListCustomerUseCase(repository)
    const output = await useCase.execute({})

    expect(output.customers.length).toBe(2)
    expect(output.customers[0].id).toBe(customer1.id)
    expect(output.customers[0].name).toBe(customer1.name)
    expect(output.customers[0].address.street).toBe(customer1.address.street)
    expect(output.customers[1].id).toBe(customer2.id)
    expect(output.customers[1].name).toBe(customer2.name)
    expect(output.customers[1].address.street).toBe(customer2.address.street)
  })
})
