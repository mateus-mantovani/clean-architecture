import { Sequelize } from 'sequelize-typescript'
import Product from '../../../domain/product/entity/product'
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository'
import { OutputListProductDto } from './list.product.dto'
import ListProductUseCase from './list.product.usecase'

describe('Integration test list product use case', () => {
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

  it('should return a list of products', async () => {
    const productRepository = new ProductRepository()
    const listProductUseCase = new ListProductUseCase(productRepository)

    const product1 = new Product('id1', 'Product A', 100)
    const product2 = new Product('id2', 'Product B', 299)

    await productRepository.create(product1)
    await productRepository.create(product2)

    const output: OutputListProductDto = {
      products: [
        {
          id: 'id1',
          name: 'Product A',
          price: 100
        },
        {
          id: 'id2',
          name: 'Product B',
          price: 299
        }
      ]
    }

    const result: OutputListProductDto = await listProductUseCase.execute({})

    expect(output).toEqual(result)
  })

  it('should return an empty list', async () => {
    const productRepository = new ProductRepository()
    const listProductUseCase = new ListProductUseCase(productRepository)

    const result: OutputListProductDto = await listProductUseCase.execute({})

    expect({ products: [] }).toEqual(result)
  })
})
