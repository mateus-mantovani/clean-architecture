import Product from '../../../domain/product/entity/product'
import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface'
import { InputFindProductDto, OutputFindProductDto } from './find.product.dto'
import FindProductUseCase from './find.product.usecase'

const product = new Product('123', 'Product A', 100)

describe('Unit Test find product use case', () => {
  it('should find a product', async () => {
    const MockRepository = (): ProductRepositoryInterface => {
      return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    }
    const productRepository = MockRepository()
    const findProductUseCase = new FindProductUseCase(productRepository)

    const input: InputFindProductDto = {
      id: '123'
    }

    const output: OutputFindProductDto = {
      id: '123',
      name: 'Product A',
      price: 100
    }

    const result: OutputFindProductDto = await findProductUseCase.execute(input)

    expect(result).toEqual(output)
  })

  it('should not find a product', async () => {
    const MockRepository = (): ProductRepositoryInterface => {
      return {
        find: jest.fn().mockImplementation(() => {
          throw new Error('Product not found')
        }),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      }
    }
    const productRepository = MockRepository()

    const findProductUseCase = new FindProductUseCase(productRepository)

    const input: InputFindProductDto = {
      id: '123'
    }

    expect(() => findProductUseCase.execute(input))
      .rejects.toThrow('Product not found')
  })
})
