import { v4 as uuid } from 'uuid'
import Address from '../entity/address'
import Customer from '../entity/customer'
import CustomerInterface from '../entity/customer.interface'

export default class CustomerFactory {
  static create (name: string): CustomerInterface {
    return new Customer(uuid(), name)
  }

  static createWithAddress (name: string, address: Address): CustomerInterface {
    const customer = new Customer(uuid(), name)
    customer.changeAddress(address)
    return customer
  }
}
