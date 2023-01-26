import Address from '../../../domain/customer/entity/address'
import CustomerFactory from '../../../domain/customer/factory/customer.factory'
import UpdateCustomerUseCase from './update.customer.usecase'

const customer = CustomerFactory.createWithAddress(
  'John',
  new Address('Street', 110, 'zip', 'city')
)

const input = {
  id: customer.id,
  name: 'John Updated',
  address: {
    street: 'Street Updated',
    number: 3994,
    zip: 'Zip updated',
    city: 'City updated'
  }
}

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    update: jest.fn()
  }
}

describe('Unit test for customer update use case', () => {
  it('should update a customer', async () => {
    const customerRepository = MockRepository()
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository)

    const output = await customerUpdateUseCase.execute(input)

    expect(output).toEqual({
      id: customer.id,
      name: 'John Updated',
      address: {
        street: 'Street Updated',
        number: 3994,
        zip: 'Zip updated',
        city: 'City updated'
      }
    })
  })
})
