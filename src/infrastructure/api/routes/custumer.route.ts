import express, { Request, Response } from 'express'
import { InputCreateCustomerDto } from '../../../usecase/customer/create/create.customer.dto'
import CreateCustomerUseCase from '../../../usecase/customer/create/create.customer.usecase'
import ListCustomerUseCase from '../../../usecase/customer/list/list.customer.usecase'
import CustomerRepository from '../../customer/repository/sequelize/customer.repository'
import CustomerPresenter from '../presenters/customer.presenter'
export const customerRoute = express.Router()

customerRoute.post('/', async (req: Request, res: Response) => {
  const useCase = new CreateCustomerUseCase(new CustomerRepository())
  try {
    const customerDto: InputCreateCustomerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zip: req.body.address.zip
      }
    }

    const output = await useCase.execute(customerDto)

    res.status(201).send(output)
  } catch (err) {
    res.status(500).send(err)
  }
})

customerRoute.get('/', async (req: Request, res: Response) => {
  const useCase = new ListCustomerUseCase(new CustomerRepository())
  try {
    const output = await useCase.execute({})

    res.format({
      json: () => res.send(output),
      xml: () => res.send(CustomerPresenter.listXML(output))
    })
  } catch (err) {
    res.status(500).send(err)
  }
})
