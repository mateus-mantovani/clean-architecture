import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import { InputCreateProductDto, OutputCreateProductDto } from './create.product.dto'
import { CreateProductUseCase } from './create.product.usecase'

describe('Integration test create product use case', () => {
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

  it('should create a product', async () => {
    const productRepository = new ProductRepository()
    const createProductUseCase = new CreateProductUseCase(productRepository)

    const input: InputCreateProductDto = {
      name: 'Product 1',
      price: 100
    }

    const output: OutputCreateProductDto = {
      id: expect.any(String),
      name: input.name,
      price: input.price
    }

    const result = await createProductUseCase.execute(input)

    expect(result).toEqual(output)
  })

  it('should throw error trying to create a product', async () => {
    const productRepository = new ProductRepository()
    const createProductUseCase = new CreateProductUseCase(productRepository)

    const input: InputCreateProductDto = {
      name: '',
      price: 100
    }

    await expect(createProductUseCase.execute(input)).rejects.toThrowError('Product name is invalid')
  })
})
