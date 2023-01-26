import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import { CreateProductUseCase } from '../create/create.product.usecase'
import { InputUpdateProductDto, OutputUpdateProductDto } from './update.product.dto'
import UpdateProductUseCase from './update.product.usecase'

describe('Integration test update product use case', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    sequelize.close()
  })

  it('should update a product', async () => {
    const productRepository = new ProductRepository()
    const createProductUseCase = new CreateProductUseCase(productRepository)
    const updateProductUseCase = new UpdateProductUseCase(productRepository)

    const product = await createProductUseCase.execute({ name: 'Product before', price: 23 })

    const input: InputUpdateProductDto = {
      id: product.id,
      name: 'Product updated',
      price: 999
    }

    const output: OutputUpdateProductDto = {
      id: product.id,
      name: input.name,
      price: input.price
    }

    const result = await updateProductUseCase.execute(input)

    expect(result).toEqual(output)
  })
})
