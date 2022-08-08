import Address from '../entity/address'
import CustomerFactory from './customer.factory'

describe('Customer factory unit test', () => {
  it('should create a customer', () => {
    const customer = CustomerFactory.create('John Doe')

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('John Doe')
    expect(customer.constructor.name).toBe('Customer')
    expect(customer.address).toBeUndefined()
  })

  it('it should create a customer with an address', () => {
    const address = new Address('123 Main St', 100, '01111111', 'São Paulo')
    const customer = CustomerFactory.createWithAddress('John Doe', address)

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('John Doe')
    expect(customer.constructor.name).toBe('Customer')
    expect(customer.address).toBeDefined()
    expect(customer.address.street).toBe('123 Main St')
    expect(customer.address.number).toBe(100)
    expect(customer.address.zipCode).toBe('01111111')
    expect(customer.address.city).toBe('São Paulo')
  })
})
