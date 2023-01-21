import Address from '../../../domain/customer/entity/address'
import Customer from '../../../domain/customer/entity/customer'
import CustomerFactory from '../../../domain/customer/factory/customer.factory'
import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repository.interface'
import { InputCreateCustomerDto, OutputCreateCustomerDto } from './create.customer.dto'

export default class CreateCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface

  constructor (customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository
  }

  async execute (input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
    const customer: Customer = CustomerFactory.createWithAddress(
      input.name,
      new Address(input.address.street, input.address.number, input.address.zip, input.address.city))

    await this.customerRepository.create(customer)

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        city: customer.address.city,
        zip: customer.address.zipCode
      }
    }
  }
}
