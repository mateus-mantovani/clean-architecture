import Address from './address'
import Customer from './customer'

describe('Customer unit test', () => {
  it('should throw errer when id is empty', () => {
    expect(() => {
      // eslint-disable-next-line
      const customer = new Customer('', 'John Doe')
    }).toThrowError('Id is required')
  })

  it('should throw error when name is empty', () => {
    expect(() => {
      // eslint-disable-next-line
      const customer = new Customer('1', '')
    }).toThrowError('Name is required')
  })

  it('should change name', () => {
    const customer = new Customer('1', 'Matth')
    customer.changeName('John Doe')
    expect(customer.name).toBe('John Doe')
  })

  it('should activate the customer', () => {
    const customer = new Customer('1', 'John Doe')
    const address = new Address('123 Main St', 123, '14401-000', 'Anytown')
    customer.changeAddress(address)

    customer.activate()
    expect(customer.isActive()).toBe(true)
  })

  it('should throw error when address is empty and there is an activation attempt', () => {
    const customer = new Customer('1', 'John Doe')
    expect(() => {
      customer.activate()
    }).toThrowError('Address is required')
  })

  it('should deactivate the customer', () => {
    const customer = new Customer('1', 'John Doe')
    expect(customer.isActive()).toBe(true)

    customer.deactivate()
    expect(customer.isActive()).toBe(false)
  })

  it('should add reward points', () => {
    const customer = new Customer('1', 'John Doe')
    expect(customer.rewardPoints).toBe(0)

    customer.addRewardPoints(100)
    expect(customer.rewardPoints).toBe(100)

    customer.addRewardPoints(50)
    expect(customer.rewardPoints).toBe(150)
  })
})
