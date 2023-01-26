import { Sequelize } from 'sequelize-typescript'
import Product from '../../../domain/product/entity/product'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import { InputFindProductDto, OutputFindProductDto } from './find.product.dto'
import FindProductUseCase from './find.product.usecase'

describe('Test find product use case', () => {
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

  it('should find a product', async () => {
    const productRepository = new ProductRepository()
    const findProductUseCase = new FindProductUseCase(productRepository)

    const product = new Product('id', 'Product B', 200)
    await productRepository.create(product)
    const input: InputFindProductDto = {
      id: 'id'
    }

    const output: OutputFindProductDto = {
      id: 'id',
      name: 'Product B',
      price: 200
    }

    const result: OutputFindProductDto = await findProductUseCase.execute(input)

    expect(result).toEqual(output)
  })

  it('should throw error when finding for a product that does not exist', async () => {
    const productRepository = new ProductRepository()
    const findProductUseCase = new FindProductUseCase(productRepository)

    const input: InputFindProductDto = {
      id: 'productid'
    }

    await expect(findProductUseCase.execute(input)).rejects.toThrowError('Product not found')
  })
})
